import { useCallback, useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import clientEnv from '@/config/clientEnv'
import { useChat, type UseChatReturn } from '@/hooks/chat/useChat'
import type { ChatMessage } from '@/hooks/chat/types'

import * as chatbotApi from './api'

export type { ChatMessage } from '@/hooks/chat/types'

export type UseCustomChatOptions = {
  threadId?: string | null
  onThreadCreated?: (threadId: string) => void
}

export type UseCustomChatReturn = UseChatReturn & {
  messages: ChatMessage[]
}

const CHAT_URL = `${clientEnv.API_BASE_URL}/api/v3/ai/chat`
const THREAD_HEADER = 'x-chatbot-thread-uuid'

export function useCustomChat(options: UseCustomChatOptions = {}): UseCustomChatReturn {
  const { threadId: threadIdProp = null, onThreadCreated } = options
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const hydratedThreadRef = useRef<string | null>(null)
  const previousThreadIdRef = useRef<string | null>(threadIdProp ?? null)

  const threadMessagesQuery = useQuery({
    queryKey: ['chatbot-thread-messages', threadIdProp],
    queryFn: () => chatbotApi.getChatbotThreadMessages({ uuid: threadIdProp! }),
    enabled: !!threadIdProp,
  })

  useEffect(() => {
    const next = threadIdProp ?? null
    if (next === previousThreadIdRef.current) return
    previousThreadIdRef.current = next
    hydratedThreadRef.current = null
    setMessages([])
  }, [threadIdProp])

  useEffect(() => {
    if (!threadIdProp || !threadMessagesQuery.data) return
    if (hydratedThreadRef.current === threadIdProp) return
    hydratedThreadRef.current = threadIdProp
    const history: ChatMessage[] = [...threadMessagesQuery.data.items]
      .reverse()
      .flatMap<ChatMessage>((m) => (m.role === 'user' || m.role === 'assistant' ? [{ id: m.uuid, role: m.role, content: m.content }] : []))
    setMessages(history)
  }, [threadIdProp, threadMessagesQuery.data])

  const handleThreadCreated = useCallback(
    (uuid: string) => {
      hydratedThreadRef.current = uuid
      previousThreadIdRef.current = uuid
      onThreadCreated?.(uuid)
    },
    [onThreadCreated],
  )

  const chat = useChat({
    url: CHAT_URL,
    threadHeaderName: THREAD_HEADER,
    threadId: threadIdProp,
    onThreadCreated: handleThreadCreated,
    setMessages,
  })

  return { ...chat, messages }
}

export const useGetPaginatedChatbotThreads = () => {
  return useInfiniteQuery({
    queryKey: ['chatbot-threads', chatbotApi.CHATBOT_AGENT_ID],
    queryFn: ({ pageParam = 1 }) => chatbotApi.getChatbotThreadsList({ page: pageParam, agent: chatbotApi.CHATBOT_AGENT_ID }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.metadata.current_page < lastPage.metadata.last_page ? lastPage.metadata.current_page + 1 : undefined),
    getPreviousPageParam: (firstPage) => (firstPage.metadata.current_page > 1 ? firstPage.metadata.current_page - 1 : undefined),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}
