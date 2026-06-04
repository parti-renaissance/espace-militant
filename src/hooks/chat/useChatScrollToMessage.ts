import { useCallback, useEffect, useRef, type RefObject } from 'react'
import type { FlatList } from 'react-native'
import { isWeb } from 'tamagui'

type HasRoleAndId = { role: string; id: string }

type Args<T extends HasRoleAndId> = {
  ref: RefObject<FlatList<T> | null>
  messages: T[]
  isLoading: boolean
  scrollToBottom: (animated?: boolean) => void
  webDomIdPrefix?: string
}

export type ChatScrollToMessage = {
  scrollToLastAssistant: () => void
  armScrollToLastUser: () => void
  scrollToInitial: () => void
}

export function useChatScrollToMessage<T extends HasRoleAndId>({ ref, messages, isLoading, scrollToBottom, webDomIdPrefix }: Args<T>): ChatScrollToMessage {
  const pendingScrollAfterSubmitRef = useRef(false)

  useEffect(() => {
    if (!pendingScrollAfterSubmitRef.current) return
    pendingScrollAfterSubmitRef.current = false
    const lastUserIndex = messages.findLastIndex((m) => m.role === 'user')
    if (lastUserIndex < 0) return
    const lastUserMessage = messages[lastUserIndex]
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (isWeb && webDomIdPrefix) {
          const el = document.getElementById(`${webDomIdPrefix}${lastUserMessage.id}`)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            return
          }
        }
        ref.current?.scrollToIndex({ index: lastUserIndex, viewPosition: 0, animated: true })
      })
    })
  }, [messages, ref, webDomIdPrefix])

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
    const lastAssistantMessage = messages[lastAssistantIndex]
    if (isWeb && webDomIdPrefix) {
      const el = document.getElementById(`${webDomIdPrefix}${lastAssistantMessage.id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    ref.current?.scrollToIndex({ index: lastAssistantIndex, viewPosition: 0, animated: true })
  }, [messages, isLoading, scrollToBottom, ref, webDomIdPrefix])

  const scrollToInitial = useCallback(() => {
    const lastUserIndex = messages.findLastIndex((m) => m.role === 'user')
    if (lastUserIndex < 0) return
    if (isWeb && webDomIdPrefix) {
      const el = document.getElementById(`${webDomIdPrefix}${messages[lastUserIndex].id}`)
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
      return
    }
    ref.current?.scrollToIndex({ index: lastUserIndex, viewPosition: 0, animated: false })
  }, [messages, ref, webDomIdPrefix])

  const armScrollToLastUser = useCallback(() => {
    pendingScrollAfterSubmitRef.current = true
  }, [])

  return { scrollToLastAssistant, armScrollToLastUser, scrollToInitial }
}
