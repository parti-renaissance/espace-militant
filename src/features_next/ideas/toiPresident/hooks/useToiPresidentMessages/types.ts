import type { ShareContent } from '@/hooks/useShareApi'

import type { ToiPresidentMessage } from '../../utils'

export type BridgeContext = {
  trackClick: (params: { source?: string; type?: string; payload?: Record<string, unknown> }) => unknown
  shareAsync: (payload: ShareContent) => unknown
  shareUrl: string
}

export type Msg<K extends ToiPresidentMessage['type']> = Extract<ToiPresidentMessage, { type: K }>
export type Handler<M extends ToiPresidentMessage> = (message: M, ctx: BridgeContext) => void
