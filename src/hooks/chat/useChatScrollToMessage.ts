import { useCallback, useEffect, useRef, type RefObject } from 'react'
import type { FlatList } from 'react-native'

type HasRole = { role: string }

type Args<T extends HasRole> = {
  ref: RefObject<FlatList<T> | null>
  messages: T[]
  isLoading: boolean
  scrollToBottom: (animated?: boolean) => void
}

export type ChatScrollToMessage = {
  scrollToLastAssistant: () => void
  armScrollToLastUser: () => void
}

export function useChatScrollToMessage<T extends HasRole>({ ref, messages, isLoading, scrollToBottom }: Args<T>): ChatScrollToMessage {
  const pendingScrollAfterSubmitRef = useRef(false)

  useEffect(() => {
    if (!pendingScrollAfterSubmitRef.current) return
    pendingScrollAfterSubmitRef.current = false
    const lastUserIndex = messages.findLastIndex((m) => m.role === 'user')
    if (lastUserIndex < 0) return
    requestAnimationFrame(() => {
      ref.current?.scrollToIndex({ index: lastUserIndex, viewPosition: 0, animated: true })
    })
  }, [messages, ref])

  const scrollToLastAssistant = useCallback(() => {
    if (isLoading) {
      scrollToBottom(true)
      return
    }
    const lastAssistantIndex = messages.findLastIndex((m) => m.role === 'assistant')
    if (lastAssistantIndex < 0) {
      scrollToBottom(true)
      return
    }
    ref.current?.scrollToIndex({ index: lastAssistantIndex, viewPosition: 0, animated: true })
  }, [messages, isLoading, scrollToBottom, ref])

  const armScrollToLastUser = useCallback(() => {
    pendingScrollAfterSubmitRef.current = true
  }, [])

  return { scrollToLastAssistant, armScrollToLastUser }
}
