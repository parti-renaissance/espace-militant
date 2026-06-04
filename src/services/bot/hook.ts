import { useCallback } from 'react'

import { useBotStore } from '@/features_next/bot/store/bot-store'
import { useChat, type UseChatReturn } from '@/hooks/chat/useChat'

import { BOT_AGENT_ID, BOT_CHAT_URL, BOT_THREAD_HEADER } from './api'
import type { BotChatMessage } from './schema'

export type UseBotChatReturn = UseChatReturn & {
  messages: BotChatMessage[]
  reset: () => void
}

export function useBotChat(): UseBotChatReturn {
  const threadId = useBotStore((s) => s.threadId)
  const messages = useBotStore((s) => s.messages)
  const setMessages = useBotStore((s) => s.setMessages)

  const chat = useChat({
    url: BOT_CHAT_URL,
    agentId: BOT_AGENT_ID,
    threadHeaderName: BOT_THREAD_HEADER,
    threadId,
    onThreadCreated: (uuid) => {
      if (useBotStore.getState().threadId !== uuid) {
        useBotStore.getState().setThreadId(uuid)
      }
    },
    setMessages,
  })

  const reset = useCallback(() => {
    chat.stop()
    useBotStore.getState().clearThread()
  }, [chat])

  return { ...chat, messages, reset }
}
