export type PeerDataType = { ready: boolean };

export type logType = { text: string, type: "success" | "info" | "warn" | "error" }

type SDP = RTCSessionDescriptionInit;
type ICE = RTCIceCandidateInit;
export type ConnectionData = { description?: SDP, candidate?: ICE };

export type textDataType = { peerId: string, text: string }
export type rawMessageDataType = string | Blob | ArrayBuffer | ArrayBufferView

export type messageDataType = {
  data: any,
  type: string
}

export type messagePeerDataType = { peerId: string, data: messageDataType }


