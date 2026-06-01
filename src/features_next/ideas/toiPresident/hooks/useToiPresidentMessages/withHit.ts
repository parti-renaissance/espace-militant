import type { ToiPresidentMessage } from '../../utils'

import { HIT_SOURCE } from './constants'
import type { Handler } from './types'

export function withHit<M extends ToiPresidentMessage>(hitPayloadOf: (message: M) => Record<string, unknown>, inner?: Handler<M>): Handler<M> {
  return (message, ctx) => {
    void ctx.trackClick({ source: HIT_SOURCE, type: message.type, payload: hitPayloadOf(message) })
    inner?.(message, ctx)
  }
}
