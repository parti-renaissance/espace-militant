import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useBotStore } from '@/features_next/bot/store/bot-store'

import { BOT_AGENT_ID, getBotThreadsList } from '../api'

export function useThreadsListFallback(storedThreadId: string | null) {
  const query = useQuery({
    queryKey: ['bot-threads-list', BOT_AGENT_ID],
    queryFn: () => getBotThreadsList({ page: 1, agent: BOT_AGENT_ID }),
    enabled: !storedThreadId,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    if (storedThreadId) return
    const items = query.data?.items
    if (!items || items.length === 0) return
    useBotStore.getState().setThreadId(items[0].uuid)
  }, [storedThreadId, query.data])
}
