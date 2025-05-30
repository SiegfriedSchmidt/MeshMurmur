import {Middleware} from "@/utils/p2p-library/abstract.ts";
import {eventDataType} from "@/utils/p2p-library/types.ts";
import {PeerInfoType} from "@/utils/p2p-library/coordinators/PeerDiscoveryCoordinator.ts";

type GossipMessage = {
  from: string,
  knownPeers: PeerInfoType[]
}

export class DiscoveryMiddleware extends Middleware {
  public onGossipMessage?: (data: GossipMessage) => void;

  call(eventData: eventDataType): boolean {
    if (eventData.datatype !== 'json' || eventData.channelType !== 'unreliable') return true
    if (eventData.type === 'gossip') {
      this.onGossipMessage?.(eventData.data as GossipMessage)
      return false
    }
    return true
  }

  sendGossipMessage(knownPeers: GossipMessage['knownPeers']) {
    this.conn.channel.unreliable.send({data: {from: this.conn.peerId, knownPeers}, type: 'gossip'});
  }
}