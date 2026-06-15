import { useCallback, useContext, useEffect, useRef, type RefObject } from 'react'
import type { FlatList } from 'react-native'
import { isWeb } from 'tamagui'

import { ScrollContext } from '@/components/AppStructure/Layout/LayoutContext'

type HasRoleAndId = { role: string; id: string }

type Args<T extends HasRoleAndId> = {
  ref: RefObject<FlatList<T> | null>
  messages: T[]
  streamedContent?: string
  isStreaming?: boolean
  webDomIdPrefix?: string
}

export type ChatScrollToMessage = {
  scrollToBottom: () => void
  armScrollToLastUser: () => void
}

export function useChatScrollToMessage<T extends HasRoleAndId>({ ref, messages, streamedContent, isStreaming, webDomIdPrefix }: Args<T>): ChatScrollToMessage {
  const { layoutRef } = useContext(ScrollContext)
  const pendingScrollAfterSubmitRef = useRef(false)

  useEffect(() => {
    if (!isStreaming) return
    if (isWeb) {
      const el = layoutRef?.current
      if (el) el.scrollTo({ top: el.scrollHeight })
      return
    }
    ref.current?.scrollToEnd({ animated: false })
  }, [streamedContent, isStreaming, layoutRef, ref])

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

  const scrollToBottom = useCallback(() => {
    if (isWeb && layoutRef?.current) {
      layoutRef.current.scrollTo({ top: layoutRef.current.scrollHeight, behavior: 'smooth' })
      return
    }
    ref.current?.scrollToEnd({ animated: true })
  }, [ref, layoutRef])

  const armScrollToLastUser = useCallback(() => {
    pendingScrollAfterSubmitRef.current = true
  }, [])

  return { scrollToBottom, armScrollToLastUser }
}
