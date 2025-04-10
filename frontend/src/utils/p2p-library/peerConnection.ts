import {
  eventDataType,
  completeMessageType,
  onFileProgressType, ChannelEventHandlers,
} from "@/utils/p2p-library/types.ts";
import {Logger} from "@/utils/logger.ts";
import {parseRTCStats} from "@/utils/p2p-library/parseRTCStart.ts";
import {WebRTCPeerConnection} from "@/utils/p2p-library/webRTCPeerConnection.ts";
import {Signaler} from "@/utils/p2p-library/abstract.ts";
import {ManagerMiddleware} from "@/utils/p2p-library/middlewares/managerMiddleware.ts";
import {SignatureMiddleware} from "@/utils/p2p-library/middlewares/signatureMiddleware.ts";
import {FileTransferMiddleware} from "@/utils/p2p-library/middlewares/fileTransferMiddleware.ts";
import {TextMiddleware} from "@/utils/p2p-library/middlewares/textMiddleware.ts";

export class PeerConnection {
  public onCompleteData?: (data: completeMessageType) => void
  public onFileProgress?: onFileProgressType
  private connection: WebRTCPeerConnection
  private managerMiddleware: ManagerMiddleware
  public connected = false;
  public connectionType = "";

  constructor(
    public readonly peerId: string,
    public readonly targetPeerId: string,
    private logger: Logger,
    private signaler: Signaler,
    private onClose: (block: boolean) => void,
    private timeout = 30000
  ) {
    this.managerMiddleware = new ManagerMiddleware(this, this.logger)
    this.managerMiddleware.add(SignatureMiddleware, 1)
    const fileTransferMiddleware = this.managerMiddleware.add(FileTransferMiddleware, 2)
    fileTransferMiddleware.onFileComplete = (data) => this.onCompleteData?.(data)
    fileTransferMiddleware.onFileProgress = (data) => this.onFileProgress?.(data)
    this.managerMiddleware.add(TextMiddleware, 3).onText = (data) => this.onCompleteData?.(data)
    this.connection = this.connect()
  }

  private connect(): WebRTCPeerConnection {
    setTimeout(() => {
      if (!this.connected) {
        this.onFinalState("timeout")
      }
    }, this.timeout)

    return new WebRTCPeerConnection(this.peerId, this.targetPeerId, this.signaler, this.logger, this.onFinalState, this.onData, this.onChannelOpen)
  }

  private onData: ChannelEventHandlers['ondata'] = (data) => {
    if (!this.managerMiddleware.call(data)) return
    this.logger.warn("Not handled data:", data)
  }

  private onChannelOpen: ChannelEventHandlers['onopen'] = (data) => {
    this.logger.info(`${data.channelType} data channel opened!`)
    this.managerMiddleware.init(data)
  }

  private onFinalState = async (state: RTCPeerConnectionState | "timeout") => {
    this.signaler.cleanup(this.targetPeerId)
    if (state === "connected") {
      this.connected = true
      const stats = await this.connection.getStats()
      const {info} = parseRTCStats(stats)
      if (info) {
        this.logger.info(`Candidates info: `, info);
        this.logger.success(`Connection is using ${info.type} server.`);
        this.connectionType = info.type
      }
      this.logger.success("Successfully connected to peer!")
    } else {
      this.disconnect()
      this.logger.error(`Error in connection to peer: ${state}!`)
    }
  }

  sendText(data: string) {
    if (this.isBlocked()) return this.logger.warn(`Cannot send message to ${this.targetPeerId}, peer is not verified!`);
    this.managerMiddleware.get(TextMiddleware)?.sendText(data)
  }

  async sendFile(file: File) {
    if (this.isBlocked()) return this.logger.warn(`Cannot send file to ${this.targetPeerId}, peer is not verified!`);
    await this.managerMiddleware.get(FileTransferMiddleware)?.sendFile(file)
  }

  get channel() {
    return this.connection.channel
  }

  isBlocked() {
    return this.managerMiddleware.isBlocked()
  }

  disconnect(block = false) {
    this.connection.cleanup()
    this.onClose(block)
  }
}