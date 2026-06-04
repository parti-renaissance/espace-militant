import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useBotStore } from '@/features_next/bot/store/bot-store'

import { getBotThreadMessages } from '../api'
import type { BotChatMessage } from '../schema'

type Params = {
  storedThreadId: string | null
  setMessages: (messages: BotChatMessage[]) => void
  hasHydratedRef: { current: boolean }
}

export function useMessagesHydration({ storedThreadId, setMessages, hasHydratedRef }: Params) {
  const query = useQuery({
    queryKey: ['bot-thread-messages', storedThreadId],
    queryFn: () => getBotThreadMessages({ uuid: storedThreadId! }),
    enabled: !!storedThreadId,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    if (!storedThreadId || !query.data) return
    if (hasHydratedRef.current) return
    if (useBotStore.getState().messages.length > 0) {
      hasHydratedRef.current = true
      return
    }
    hasHydratedRef.current = true
    const history = [...query.data.items]
      .reverse()
      .flatMap<BotChatMessage>((m) => (m.role === 'user' || m.role === 'assistant' ? [{ id: m.uuid, role: m.role, content: m.content }] : []))
    setMessages(history)
  }, [storedThreadId, query.data, setMessages, hasHydratedRef])
}
