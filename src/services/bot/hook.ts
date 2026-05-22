import { useCallback, useEffect, useRef, useState } from 'react'
import i18next from 'i18next'

import { useBotStore } from '@/store/bot-store'
import { useUserStore } from '@/store/user-store'

import { BOT_AGENT_ID, BOT_CHAT_URL, BOT_THREAD_HEADER } from './api'
import { useMessagesHydration } from './hooks/useMessagesHydration'
import { useSSEStream } from './hooks/useSSEStream'
import { useThreadsListFallback } from './hooks/useThreadsListFallback'
import type { BotChatError, BotChatMessage, RestBotChatRequest } from './schema'
import { classifyHttpError } from './utils/classifyHttpError'

export type UseBotChatReturn = {
  messages: BotChatMessage[]
  input: string
  handleInputChange: (value: string) => void
  handleSubmit: () => void
  isLoading: boolean
  streamedContent: string
  error: BotChatError | null
  retry: () => void
  stop: () => void
  submit: (text: string) => void
  reset: () => void
}

export function useBotChat(): UseBotChatReturn {
  const storedThreadId = useBotStore((s) => s.threadId)
  const messages = useBotStore((s) => s.messages)
  const setMessages = useBotStore((s) => s.setMessages)

  const [input, setInput] = useState('')
  const [streamedContent, setStreamedContent] = useState('')
  const [error, setError] = useState<BotChatError | null>(null)

  const threadIdRef = useRef<string | null>(storedThreadId)
  const lastUserMessageRef = useRef<string | null>(null)
  const streamBufferRef = useRef('')
  const hadInStreamErrorRef = useRef(false)
  const hasHydratedOnceRef = useRef(false)

  useEffect(() => {
    if (storedThreadId !== threadIdRef.current) {
      threadIdRef.current = storedThreadId
    }
  }, [storedThreadId])

  useThreadsListFallback(storedThreadId)
  useMessagesHydration({ storedThreadId, setMessages, hasHydratedRef: hasHydratedOnceRef })

  const commitStreamedMessage = useCallback(() => {
    if (!streamBufferRef.current) return
    setMessages((m) => [...m, { id: `stream-${Date.now()}`, role: 'assistant', content: streamBufferRef.current }])
    setStreamedContent('')
    streamBufferRef.current = ''
  }, [setMessages])

  const stream = useSSEStream({
    url: BOT_CHAT_URL,
    threadHeaderName: BOT_THREAD_HEADER,
    getAuthToken: () => useUserStore.getState().user?.accessToken,
    onThreadHeader: (uuid) => {
      threadIdRef.current = uuid
      if (useBotStore.getState().threadId !== uuid) {
        useBotStore.getState().setThreadId(uuid)
        hasHydratedOnceRef.current = true
      }
    },
    onChunk: (text) => {
      streamBufferRef.current += text
      setStreamedContent(streamBufferRef.current)
    },
    onInStreamError: () => {
      hadInStreamErrorRef.current = true
    },
    onComplete: () => {
      if (hadInStreamErrorRef.current) {
        commitStreamedMessage()
        setError({ kind: 'serviceDown', message: i18next.t('bot.errors.serviceDown'), retryable: true })
      } else if (streamBufferRef.current) {
        commitStreamedMessage()
      } else {
        setError({ kind: 'truncated', message: i18next.t('bot.errors.truncated'), retryable: true })
      }
    },
    onError: (err) => {
      if (err.kind === 'http') {
        setError(classifyHttpError(err.status, err.retryAfterHeader))
      } else if (err.kind === 'timeout') {
        setError({ kind: 'timeout', message: i18next.t('bot.errors.timeout'), retryable: true })
      } else {
        setError({ kind: 'network', message: i18next.t('bot.errors.network'), retryable: true })
      }
    },
    onAbort: () => {
      commitStreamedMessage()
    },
  })

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return

      lastUserMessageRef.current = trimmed
      hadInStreamErrorRef.current = false
      streamBufferRef.current = ''

      setMessages((prev) => [...prev, { id: `local-${Date.now()}`, role: 'user', content: trimmed }])
      setError(null)
      setStreamedContent('')

      const body: RestBotChatRequest = {
        message: trimmed,
        agent_id: BOT_AGENT_ID,
        ...(threadIdRef.current ? { thread_id: threadIdRef.current } : {}),
      }
      stream.start(body)
    },
    [setMessages, stream],
  )

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value)
      if (error) setError(null)
    },
    [error],
  )

  const handleSubmit = useCallback(() => {
    if (!input.trim() || stream.isStreaming) return
    const message = input.trim()
    setInput('')
    sendMessage(message)
  }, [input, sendMessage, stream.isStreaming])

  const retry = useCallback(() => {
    if (!lastUserMessageRef.current || stream.isStreaming) return
    setMessages((m) => {
      if (m.length > 0 && m[m.length - 1].role === 'user' && m[m.length - 1].content === lastUserMessageRef.current) {
        return m.slice(0, -1)
      }
      return m
    })
    sendMessage(lastUserMessageRef.current)
  }, [sendMessage, setMessages, stream.isStreaming])

  const submit = useCallback(
    (text: string) => {
      if (stream.isStreaming) return
      sendMessage(text)
    },
    [sendMessage, stream.isStreaming],
  )

  const reset = useCallback(() => {
    stream.stop()
    threadIdRef.current = null
    hasHydratedOnceRef.current = false
    lastUserMessageRef.current = null
    hadInStreamErrorRef.current = false
    streamBufferRef.current = ''
    setStreamedContent('')
    setError(null)
    useBotStore.getState().clearThread()
  }, [stream])

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: stream.isStreaming,
    streamedContent,
    error,
    retry,
    stop: stream.stop,
    submit,
    reset,
  }
}
