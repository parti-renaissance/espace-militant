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
  /** Scroll animé vers le début du dernier message du bot (ou tout en bas si stream en cours / pas de message bot). */
  scrollToLastAssistant: () => void
  /** Arme un scroll automatique vers le début du dernier message utilisateur dès qu'un nouveau message est ajouté. */
  armScrollToLastUser: () => void
  /** Scroll instantané (sans animation) vers le début du dernier message du bot, ou tout en bas en fallback. */
  scrollToInitial: () => void
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

  const scrollToInitial = useCallback(() => {
    const lastAssistantIndex = messages.findLastIndex((m) => m.role === 'assistant')
    if (lastAssistantIndex < 0) {
      ref.current?.scrollToEnd({ animated: false })
      return
    }
    ref.current?.scrollToIndex({ index: lastAssistantIndex, viewPosition: 0, animated: false })
  }, [messages, ref])

  const armScrollToLastUser = useCallback(() => {
    pendingScrollAfterSubmitRef.current = true
  }, [])

  return { scrollToLastAssistant, armScrollToLastUser, scrollToInitial }
}
