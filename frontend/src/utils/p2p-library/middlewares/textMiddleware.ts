import {Middleware} from "@/utils/p2p-library/abstract.ts";
import {processedTextType, eventDataType} from "@/utils/p2p-library/types.ts";

export class TextMiddleware extends Middleware {
  public onText?: (data: processedTextType) => void

  call(eventData: eventDataType) {
    if (eventData.datatype !== 'json' || eventData.channelType !== 'reliable') return true
    if (eventData.type === "text") {
      this.onText?.({data: eventData.data as string})
      return false
    }
    return true
  }

  public sendText(data: string) {
    this.conn.channel.reliable.send({data, type: 'text'})
  }
}