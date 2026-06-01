import type { ToiPresidentMessage } from '../../utils'

import { shareGeneric, shareProfile } from './shareHandlers'
import type { BridgeContext, Handler, Msg } from './types'
import { withHit } from './withHit'

type HandlerMap = { [K in ToiPresidentMessage['type']]: Handler<Msg<K>> }

const HANDLERS: HandlerMap = {
  VOTE: withHit<Msg<'VOTE'>>((m) => m.payload),
  SUBMISSION: withHit<Msg<'SUBMISSION'>>((m) => m.payload),
  SHARE_PROFILE: withHit<Msg<'SHARE_PROFILE'>>((m) => ({ mimeType: m.payload.mimeType }), shareProfile),
  share: shareGeneric,
}

export function dispatchMessage(message: ToiPresidentMessage, ctx: BridgeContext): void {
  ;(HANDLERS[message.type] as Handler<ToiPresidentMessage>)(message, ctx)
}
