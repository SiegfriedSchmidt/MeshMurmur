import {connectionStageType, conversationModeType} from "@p2p-library/types.ts";
import {Logger} from "@p2p-library/logger.ts";
import {ICEInfo, parseRTCStats} from "@p2p-library/parseRTCStart.ts";
import {WebRTCPeerConnection} from "@p2p-library/connection/webRTCPeerConnection.ts";
import {Signaler} from "@p2p-library/abstract.ts";
import {ManagerMiddleware} from "@p2p-library/middlewares/managerMiddleware.ts";
import {SignatureMiddleware} from "@p2p-library/middlewares/signatureMiddleware.ts";
import {FileTransferMiddleware} from "@p2p-library/middlewares/fileTransferMiddleware.ts";
import {TextMiddleware} from "@p2p-library/middlewares/textMiddleware.ts";
import {TypingEventMiddleware} from "@p2p-library/middlewares/typingEventMiddleware.ts";
import {NicknameMiddleware} from "@p2p-library/middlewares/nicknameMiddleware.ts";
import {DiscoveryMiddleware} from "@p2p-library/middlewares/discoveryMiddleware.ts";
import {DisconnectEventMiddleware} from "@p2p-library/middlewares/disconnectEventMiddleware.ts";
import {AppConfig} from "@p2p-library/conf.ts";
import {PingMiddleware} from "@p2p-library/middlewares/pingMiddleware.ts";
import {NegotiationManager, NegotiationPackageType} from "@p2p-library/connection/negotiationManager.ts";
import {isPolite} from "@p2p-library/helpers.ts";
import {RTCConfigHelper} from "@p2p-library/RTCConfigHelper.ts";

export class PeerConnection {
  private connection?: WebRTCPeerConnection
  private connectTimeoutId?: NodeJS.Timeout
  public managerMiddleware?: ManagerMiddleware
  public negotiationManager: NegotiationManager
  public connectionStage: connectionStageType = "negotiating";
  public connectionICEInfo?: ICEInfo;

  constructor(
    public readonly peerId: string,
    public readonly targetPeerId: string,
    mode: conversationModeType,
    private readonly logger: Logger,
    private readonly signaler: Signaler,
    private readonly rtcConfigHelper: RTCConfigHelper,
    private onPeerConnectionChanged: (status: connectionStageType, block?: boolean, error?: boolean) => void,
    private onStream?: (stream: MediaStream) => void
  ) {
    this.negotiationManager = new NegotiationManager(
      isPolite(peerId, targetPeerId),
      mode,
      logger.createChild("Negotiation"),
      (np) => signaler.sendNegotiationPackage(targetPeerId, np)
    )
  }

  is_connected() {
    return this.connectionStage === "connected"
  }

  async connect(np?: NegotiationPackageType, stream?: MediaStream): Promise<ManagerMiddleware | undefined> {
    this.connectTimeoutId = setTimeout(() => {
      if (!this.is_connected()) {
        this.disconnect(false, true)
        this.logger.error("Error in connection to peer: timeout!")
      }
    }, AppConfig.connectingTimeout)

    this.negotiationManager.startNegotiation(np);
    if (!await this.negotiationManager.negotiation) {
      return undefined
    }

    this.connectionStage = 'connecting'
    this.onPeerConnectionChanged('connecting')

    const connection = new WebRTCPeerConnection(this.peerId, this.targetPeerId, this.signaler, this.logger.createChild("WebRTC"), this.rtcConfigHelper)
    this.connection = connection

    const managerMiddleware = new ManagerMiddleware(this.peerId, this.targetPeerId, this.connection.channel, this.logger)
    this.managerMiddleware = managerMiddleware
    managerMiddleware.add(SignatureMiddleware, 1)
    managerMiddleware.add(FileTransferMiddleware, 2)
    managerMiddleware.add(TextMiddleware, 3)
    managerMiddleware.add(TypingEventMiddleware, 4)
    managerMiddleware.add(NicknameMiddleware, 5)
    managerMiddleware.add(DisconnectEventMiddleware, 6)
    managerMiddleware.add(DiscoveryMiddleware, 7)
    managerMiddleware.add(PingMiddleware, 8)

    const onFinalState = async (state: RTCPeerConnectionState | "timeout") => {
      if (state === "connected") {
        await managerMiddleware.waitForAllInitialized()
        this.connectionStage = "connected"
        if (this.connectTimeoutId) clearTimeout(this.connectTimeoutId)
        const stats = await connection.getStats()
        const info = parseRTCStats(stats)
        if (info) {
          this.logger.info(`ICE IP: `, info.remote.address);
          this.logger.info(`Connection is using ${info.type} server.`);
          this.connectionICEInfo = info
        }
        this.onPeerConnectionChanged('connected');
        this.logger.info(`Connected to ${this.targetPeerId}`)
      } else {
        this.disconnect(false, true)
        this.logger.error(`Error in connection to peer: ${state}!`)
      }
    }

    this.connection.connect({
      ondata: (data) => {
        if (!managerMiddleware.call(data)) return
        this.logger.warn("Not handled data:", data)
      },
      onopen: (data) => {
        // this.logger.info(`${data.channelType} data channel opened!`)
        managerMiddleware.init(data)
      },
      onclose: () => null,
      onerror: () => null,
      // onclose: ({channelType}) => this.logger.info(`${channelType} channel closed`),
      // onerror: ({error}) => this.logger.info(error)
    }, onFinalState, stream, stream => this.onStream?.(stream))

    return managerMiddleware
  }

  async ping(): Promise<number> {
    if (this.connectionStage === "connected") {
      this.connectionStage = "pinging"
      const latency = await this.managerMiddleware?.get(PingMiddleware)?.sendPing()
      if (latency) {
        this.connectionStage = "connected"
        return latency
      }
    }
    return 0
  }

  disconnect(block = false, error = false) {
    this.managerMiddleware?.get(PingMiddleware)?.resolvePing(false)
    if (this.connectTimeoutId) clearTimeout(this.connectTimeoutId)
    this.connection?.cleanup()
    this.connectionStage = "disconnected"
    this.onPeerConnectionChanged("disconnected", block, error)
    this.logger.info(`Disconnected from ${this.targetPeerId}`)
  }
}