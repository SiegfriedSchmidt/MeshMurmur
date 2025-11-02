import {signalers} from "@p2p-library/conf.ts";

export type PeerDataType = { ready: boolean };

export type connectionStageType =
  | "connected"
  | "negotiating"
  | "connecting"
  | "pinging"
  | "reconnecting"
  | "disconnected"

export type conversationModeType = "Chat" | "VoiceCall" | "VideoCall"

export type logType = { text: string, type: "success" | "info" | "warn" | "error" | "debug" }

export type signalerNameType = keyof typeof signalers

type SDP = RTCSessionDescriptionInit;
type ICE = RTCIceCandidateInit;
export type ConnectionData = { description?: SDP, candidate?: ICE | null };

export type dataChannelTransferType = 'reliable' | 'unordered' | 'unreliable';

export interface ChannelEventBase {
  channelType: dataChannelTransferType
}

export type eventDataType =
  ChannelEventBase & { datatype: 'json' } & jsonDataType |
  ChannelEventBase & { datatype: 'byte' } & byteDataType

export type ChannelEventHandlers = {
  onopen: (event: ChannelEventBase) => void;
  ondata: (event: eventDataType) => void;
  onclose: (event: ChannelEventBase) => void;
  onerror: (event: ChannelEventBase & { error: RTCErrorEvent }) => void;
};

export type jsonDataType = { data: unknown, type: string }
export type byteDataType = { data: ArrayBuffer, metadata: unknown }


export type processedTextType = { data: string }
export type processedFileType = {
  data: {
    url: string
    fileName: string
    fileSize: number
    fileType: string
  }
}

type commonCompleteType = { peerId: string, nickname: string }
export type completeTextType = commonCompleteType & processedTextType
export type completeFileType = commonCompleteType & processedFileType
export type chatMemberBadge = commonCompleteType & { status: 'enter' | 'exit', time: number }

export type completeMessageType = completeTextType | completeFileType | chatMemberBadge

export type fileProgressType = { title: string, progress: number, bitrate: number, fileId: string }
export type onFileProgressType = (data: fileProgressType) => void

