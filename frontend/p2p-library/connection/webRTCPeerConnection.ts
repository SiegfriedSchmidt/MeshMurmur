import {BasicSignaler} from "@p2p-library/abstract.ts";
import {Logger} from "@p2p-library/logger.ts";
import {DataChannels} from "@p2p-library/connection/DataChannel.ts";
import {ChannelEventHandlers} from "@p2p-library/types.ts";
import {isPolite} from "@p2p-library/helpers.ts";
import {RTCConfigHelper} from "@p2p-library/RTCConfigHelper.ts";

export class WebRTCPeerConnection {
  private readonly pc: RTCPeerConnection;
  private makingOffer = false
  private ignoreOffer = false;
  private isSettingRemoteAnswerPending = false;

  public readonly channel: DataChannels;

  constructor(
    private readonly peerId: string,
    private readonly targetPeerId: string,
    private readonly signaler: BasicSignaler,
    private readonly logger: Logger,
    rtcConfigHelper: RTCConfigHelper
  ) {
    this.pc = new RTCPeerConnection(rtcConfigHelper.get());
    this.channel = new DataChannels(this.pc)
  }

  connect(
    handlers: ChannelEventHandlers,
    onFinalState: (state: RTCPeerConnectionState) => void,
    stream?: MediaStream,
    onStream?: (stream: MediaStream) => void
  ) {
    this.channel.registerEvents(handlers)

    if (stream && onStream) {
      for (const track of stream.getTracks()) {
        this.pc.addTrack(track, stream);
      }

      this.pc.ontrack = ({track, streams}) => {
        track.onunmute = () => {
          onStream(streams[0])
        };
      };
    }

    const polite = isPolite(this.peerId, this.targetPeerId)

    this.logger.info(`START CONNECTION AS ${polite ? "POLITE" : "IMPOLITE"} PEER`)
    this.startDebugListeners()

    this.pc.onconnectionstatechange = () => {
      if (this.pc.connectionState === "connecting" ||
        this.pc.connectionState === "new") return

      onFinalState(this.pc.connectionState);
    }

    // Handle ICE candidates
    this.pc.onicecandidate = ({candidate}) => {
      this.signaler.send(this.targetPeerId, {candidate: candidate ? candidate.toJSON() : null})
      this.logger.info(`Send ice candidate: `)
      this.logger.debug(candidate)
    };

    // offer
    this.pc.onnegotiationneeded = async () => {
      if (polite) return // Weird solution to all negotiation problems
      try {
        this.makingOffer = true;
        await this.pc.setLocalDescription();
        this.signaler.send(this.targetPeerId, {description: this.pc.localDescription?.toJSON()});
        this.logger.info(`Send offer: `)
        this.logger.debug(this.pc.localDescription)
      } catch (err) {
        this.logger.error("Error sending offer:", err);
      } finally {
        this.makingOffer = false;
      }
    };

    // on candidate or description
    this.signaler.on(this.targetPeerId, async ({description, candidate}) => {
      try {
        if (description) {
          const readyForOffer = !this.makingOffer &&
            (this.pc.signalingState === "stable" || this.isSettingRemoteAnswerPending);
          const offerCollision = description.type === "offer" && !readyForOffer;

          this.ignoreOffer = !polite && offerCollision;
          if (this.ignoreOffer) {
            this.logger.info("Ignore offer: ");
            this.logger.debug(description);
            return;
          }

          this.isSettingRemoteAnswerPending = description.type === "answer";
          await this.pc.setRemoteDescription(description);
          this.isSettingRemoteAnswerPending = false;

          this.logger.info(`Receive ${description.type}: `);
          this.logger.debug(description);
          if (description.type === "offer") {
            await this.pc.setLocalDescription();
            this.signaler.send(this.targetPeerId, {description: this.pc.localDescription?.toJSON()});
            this.logger.info("Send answer: ");
            this.logger.debug(this.pc.localDescription)
          }
        } else if (candidate) {
          try {
            await this.pc.addIceCandidate(candidate);
            this.logger.info("Receive ice candidate: ");
            this.logger.debug(candidate)
          } catch (err) {
            if (!this.ignoreOffer) {
              this.logger.error("Error adding candidate: ", err);
            }
          }
        }
      } catch (err) {
        this.logger.error("Error with description receiving: ", err);
      }
    })
  }

  startDebugListeners() {
    this.pc.onconnectionstatechange = () => {
      this.logger.debug("Connection state changed:", this.pc.connectionState);
    };

    this.pc.onsignalingstatechange = () => {
      this.logger.debug("Signaling state changed:", this.pc.signalingState);
    };

    this.pc.onicegatheringstatechange = () => {
      this.logger.debug("ICE gathering state changed:", this.pc.iceGatheringState);
    };

    this.pc.oniceconnectionstatechange = () => {
      console.debug('ICE connection state changed:', this.pc.iceConnectionState)
    };

    this.pc.onicecandidateerror = (event) => {
      this.logger.debug("Ice candidate error: ", event.errorText, event.url);
    }
  }

  async getStats() {
    return await this.pc.getStats(null)
  }

  cleanup() {
    this.pc.close()
    this.signaler.off(this.targetPeerId)
  }
}
