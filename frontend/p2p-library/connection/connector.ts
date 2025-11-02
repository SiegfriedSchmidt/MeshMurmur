import {Logger} from '@p2p-library/logger.ts'
import {PeerConnection} from "@p2p-library/connection/peerConnection.ts";
import {ActionManager} from "@p2p-library/connection/actionManager.ts";
import {Signaler} from "@p2p-library/abstract.ts";
import {createSignaler} from "@p2p-library/signalers/createSignaler.ts";
import {connectionStageType, conversationModeType, signalerNameType} from "@p2p-library/types.ts";
import {NegotiationManager, NegotiationPackageType} from "@p2p-library/connection/negotiationManager.ts";
import {AppConfig} from "@p2p-library/conf.ts";
import {TypedEventEmitter} from "@p2p-library/eventEmitter.ts";
import {RTCConfigHelper} from "@p2p-library/RTCConfigHelper.ts";
import {ED25519KeyPairManager} from "@p2p-library/crypto/ed25519KeyManager.ts";

export interface ConnectorConfig {
  signaler: signalerNameType
  autoconnect: boolean
  autoreconnect: boolean
}

export class Connector {
  private readonly signaler: Signaler;
  public connections: { [peerId: string]: PeerConnection } = {}
  public actions: ActionManager
  public eventEmitter = new TypedEventEmitter<{
    onPeerConnectionChanged: { targetPeerId: string, status: connectionStageType }
    onCall: { np: NegotiationPackageType, targetPeerId: string }
  }>();
  public blackList: Set<string> = new Set()
  public potentialPeers: Set<string> = new Set()

  constructor(
    public peerId: string,
    private __config: ConnectorConfig,
    private rtcConfigHelper: RTCConfigHelper,
    private logger: Logger,
    edKeyManager: ED25519KeyPairManager,
  ) {
    this.actions = new ActionManager(this, edKeyManager, logger);
    this.signaler = createSignaler(this.config.signaler, this.peerId, this.logger);
  }

  async init() {
    const disconnect = async (removedPeerId: string) => {
      if (removedPeerId in this.connections) {
        const pc = this.connections[removedPeerId]
        if (await pc.ping()) {
          this.logger.info(`Still connected to ${removedPeerId}.`)
        } else {
          if (pc.connectionStage !== 'disconnected') {
            this.logger.warn(`${this.actions.targetPeerNickname(removedPeerId)} disconnected by exit.`);
            pc.disconnect()
          }
        }
      }
      this.potentialPeers.delete(removedPeerId);
    }

    this.signaler.onNegotiationPackage = (targetPeerId, np) => {
      if (targetPeerId in this.connections) {
        this.connections[targetPeerId].negotiationManager.onNegotiationPackage(np)
      } else {
        this.createConnection(targetPeerId, false, np)
      }
    };
    this.signaler.onAddedPeer = (targetPeerId) => this.createConnection(targetPeerId)
    this.signaler.onRemovedPeer = disconnect
    this.signaler.onPeerList = (peerIds) => {
      const peersSet = new Set(peerIds)
      for (const peerId of this.potentialPeers) {
        if (!peersSet.has(peerId)) {
          disconnect(peerId);
        }
      }
      for (const peerId of peersSet) {
        if (!this.potentialPeers.has(peerId)) {
          this.createConnection(peerId);
        }
      }
    }

    this.signaler.registerPeer({ready: this.config.autoconnect});
    this.logger.info(`Registered peer [${this.signaler.info()}]: ${this.peerId}.`);
  }

  get config() {
    return this.__config
  }

  public updateConfig(newConfig: ConnectorConfig) {
    if (newConfig.signaler !== this.__config.signaler) return // not be able to change signaler while running
    this.__config = newConfig;
    this.signaler.setPeerData({ready: this.config.autoconnect});
  }

  public async createConnection(targetPeerId: string, manual = false, np?: NegotiationPackageType, stream?: MediaStream, onStream?: (stream: MediaStream) => void) {
    if (targetPeerId === this.peerId) return
    this.potentialPeers.add(targetPeerId);
    if (targetPeerId in this.connections) return

    const allowed = this.isPeerAllowedToConnect(targetPeerId, manual, !!np)
    if (!allowed) {
      if (np) {
        NegotiationManager.reject((_np) => this.signaler.sendNegotiationPackage(targetPeerId, _np))
        this.logger.info(`Incoming connection rejected ${targetPeerId}.`)
      } else {
        this.logger.info(`Outgoing connection rejected ${targetPeerId}.`)
      }
      return
    }

    if (!manual && np && np.t === 'offer' && np.description.mode === "VoiceCall") {
      return this.eventEmitter.emit("onCall", {np, targetPeerId})
    }

    const mode: conversationModeType = stream ? "VoiceCall" : "Chat"
    this.connections[targetPeerId] = new PeerConnection(this.peerId, targetPeerId, mode, this.logger, this.signaler, this.rtcConfigHelper, this.createOnPeerConnectionChanged(targetPeerId), onStream);
    this.connections[targetPeerId].negotiationManager.reconnect = (np) => {
      const nickname = this.actions.targetPeerNickname(targetPeerId)
      const pc = this.connections[targetPeerId]
      const connectionStage = pc.connectionStage
      pc.disconnect()

      if (connectionStage === 'pinging') {
        this.logger.warn(`Reconnecting after reload to ${nickname}...`)
      } else {
        this.logger.warn(`Reconnecting after remote peer wish to ${nickname}...`)
      }

      this.createConnection(targetPeerId, false, np)
    }

    this.eventEmitter.emit('onPeerConnectionChanged', {targetPeerId, status: 'negotiating'})
    const managerMiddleware = await this.connections[targetPeerId].connect(np, stream)

    if (managerMiddleware) {
      this.actions.registerCallbacksAndData(managerMiddleware, targetPeerId)
    } else {
      this.connections[targetPeerId].disconnect()
    }
  }

  private isPeerAllowedToConnect(targetPeerId: string, manual: boolean, incoming: boolean): boolean {
    if (manual) return true
    return !this.blackList.has(targetPeerId) &&
      (incoming || this.config.autoconnect && !incoming) &&
      this.peers.length < AppConfig.maxNumberOfPeers &&
      (incoming || this.peers.length < AppConfig.maxNumberOfOutgoingConnections)
  }

  private createOnPeerConnectionChanged(targetPeerId: string) {
    return (status: connectionStageType, block?: boolean, error?: boolean) => {
      if (status === "disconnected") {
        this.eventEmitter.emit('onPeerConnectionChanged', {targetPeerId, status})
        delete this.connections[targetPeerId]
        if (block) {
          this.blackList.add(targetPeerId)
        } else {
          if (error && this.config.autoreconnect) {
            this.logger.warn(`Reconnecting after error to ${this.actions.targetPeerNickname(targetPeerId)}.`)
            void this.createConnection(targetPeerId)
          }
        }
        return
      } else if (status === "connected") {
        this.logger.success(`Connected to ${this.actions.targetPeerNickname(targetPeerId)}.`);
      }
      this.eventEmitter.emit('onPeerConnectionChanged', {targetPeerId, status})
    }
  }

  get peers() {
    return Object.values(this.connections)
  }

  get connectedPeers() {
    return this.peers.filter((conn) => conn.is_connected())
  }

  cleanup() {
  }
}