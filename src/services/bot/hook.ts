import { useCallback, useEffect, useRef, useState } from 'react'
import i18next from 'i18next'

import { useBotStore } from '@/store/bot-store'
import { useUserStore } from '@/store/user-store'

import { BOT_AGENT_ID, BOT_CHAT_URL, BOT_THREAD_HEADER } from './api'
import { useMessagesHydration } from './hooks/useMessagesHydration'
import { useThreadsListFallback } from './hooks/useThreadsListFallback'
import type { BotChatError, BotChatMessage, RestBotChatRequest } from './schema'
import { classifyHttpError } from './utils/classifyHttpError'
import { parseSSEChunk } from './utils/parseSSEChunk'

const FIRST_CHUNK_TIMEOUT_MS = 30_000

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
  const [isLoading, setIsLoading] = useState(false)
  const [streamedContent, setStreamedContent] = useState('')
  const [error, setError] = useState<BotChatError | null>(null)

  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const streamBufferRef = useRef('')
  const lastProcessedIndexRef = useRef(0)
  const lineBufferRef = useRef('')
  const isMountedRef = useRef(true)
  const abortedByUserRef = useRef(false)
  const lastUserMessageRef = useRef<string | null>(null)
  const firstChunkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstChunkReceivedRef = useRef(false)
  const threadIdRef = useRef<string | null>(storedThreadId)
  const inStreamErrorRef = useRef<string | null>(null)
  const threadNotifiedRef = useRef(false)
  const hasHydratedOnceRef = useRef(false)

  useEffect(() => {
    if (storedThreadId !== threadIdRef.current) {
      threadIdRef.current = storedThreadId
    }
  }, [storedThreadId])

  useThreadsListFallback(storedThreadId)
  useMessagesHydration({ storedThreadId, setMessages, hasHydratedRef: hasHydratedOnceRef })

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (xhrRef.current) {
        abortedByUserRef.current = true
        xhrRef.current.abort()
        xhrRef.current = null
      }
      if (firstChunkTimerRef.current) {
        clearTimeout(firstChunkTimerRef.current)
        firstChunkTimerRef.current = null
      }
    }
  }, [])

  const clearFirstChunkTimer = useCallback(() => {
    if (firstChunkTimerRef.current) {
      clearTimeout(firstChunkTimerRef.current)
      firstChunkTimerRef.current = null
    }
  }, [])

  const commitStreamedMessage = useCallback(() => {
    if (!streamBufferRef.current) return
    setMessages((m) => [...m, { id: `stream-${Date.now()}`, role: 'assistant', content: streamBufferRef.current }])
    setStreamedContent('')
    streamBufferRef.current = ''
  }, [setMessages])

  const cleanupRequest = useCallback((): boolean => {
    clearFirstChunkTimer()
    xhrRef.current = null
    if (!isMountedRef.current) return false
    setIsLoading(false)
    return true
  }, [clearFirstChunkTimer])

  const resetRequestState = useCallback((userMessage: string) => {
    abortedByUserRef.current = false
    firstChunkReceivedRef.current = false
    threadNotifiedRef.current = false
    inStreamErrorRef.current = null
    lastUserMessageRef.current = userMessage
    streamBufferRef.current = ''
    lastProcessedIndexRef.current = 0
    lineBufferRef.current = ''
  }, [])

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value)
      if (error) setError(null)
    },
    [error],
  )

  const stop = useCallback(() => {
    if (xhrRef.current) {
      abortedByUserRef.current = true
      xhrRef.current.abort()
      xhrRef.current = null
    }
    clearFirstChunkTimer()
  }, [clearFirstChunkTimer])

  const sendMessage = useCallback(
    (messageText: string) => {
      const trimmed = messageText.trim()
      if (!trimmed) return

      resetRequestState(trimmed)
      const userMessage: BotChatMessage = { id: `local-${Date.now()}`, role: 'user', content: trimmed }
      setMessages((prev) => [...prev, userMessage])
      setError(null)
      setStreamedContent('')
      setIsLoading(true)

      const body: RestBotChatRequest = {
        message: trimmed,
        agent_id: BOT_AGENT_ID,
        ...(threadIdRef.current ? { thread_id: threadIdRef.current } : {}),
      }

      const accessToken = useUserStore.getState().user?.accessToken
      const xhr = new XMLHttpRequest()
      xhrRef.current = xhr

      xhr.open('POST', BOT_CHAT_URL, true)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.setRequestHeader('Accept', 'text/event-stream')
      if (accessToken) {
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
      }

      firstChunkTimerRef.current = setTimeout(() => {
        if (firstChunkReceivedRef.current || xhrRef.current !== xhr) return
        abortedByUserRef.current = false
        xhr.abort()
        if (!cleanupRequest()) return
        setError({ kind: 'timeout', message: i18next.t('bot.errors.timeout'), retryable: true })
      }, FIRST_CHUNK_TIMEOUT_MS)

      xhr.onreadystatechange = () => {
        if (xhr.readyState >= 2 && !threadNotifiedRef.current) {
          const headerThreadId = xhr.getResponseHeader(BOT_THREAD_HEADER)
          if (headerThreadId) {
            threadNotifiedRef.current = true
            threadIdRef.current = headerThreadId
            if (useBotStore.getState().threadId !== headerThreadId) {
              useBotStore.getState().setThreadId(headerThreadId)
              hasHydratedOnceRef.current = true
            }
          }
        }

        if (xhr.readyState === 3 || xhr.readyState === 4) {
          const fullText = xhr.responseText
          const from = lastProcessedIndexRef.current
          if (from < fullText.length) {
            firstChunkReceivedRef.current = true
            clearFirstChunkTimer()
            const newPart = fullText.substring(from)
            lastProcessedIndexRef.current = fullText.length
            lineBufferRef.current += newPart
          }

          const lines = lineBufferRef.current.split('\n')
          const endIndex = xhr.readyState === 4 ? lines.length : Math.max(0, lines.length - 1)
          for (let i = 0; i < endIndex; i++) {
            const chunk = parseSSEChunk(lines[i])
            if (!chunk) continue
            if (chunk.kind === 'error') {
              inStreamErrorRef.current = chunk.message || ''
            } else {
              streamBufferRef.current += chunk.text
            }
          }

          lineBufferRef.current = xhr.readyState === 4 ? '' : (lines[lines.length - 1] ?? '')

          if (isMountedRef.current) setStreamedContent(streamBufferRef.current)
        }

        if (xhr.readyState === 4) {
          if (!cleanupRequest()) return

          if (xhr.status >= 200 && xhr.status < 300) {
            if (inStreamErrorRef.current !== null) {
              commitStreamedMessage()
              setError({ kind: 'serviceDown', message: i18next.t('bot.errors.serviceDown'), retryable: true })
            } else if (streamBufferRef.current) {
              commitStreamedMessage()
            } else {
              setError({ kind: 'truncated', message: i18next.t('bot.errors.truncated'), retryable: true })
            }
          } else if (xhr.status !== 0) {
            setError(classifyHttpError(xhr.status, xhr.getResponseHeader('Retry-After')))
          } else if (!abortedByUserRef.current) {
            setError({ kind: 'network', message: i18next.t('bot.errors.network'), retryable: true })
          }
        }
      }

      xhr.onerror = () => {
        if (!cleanupRequest()) return
        setError({ kind: 'network', message: i18next.t('bot.errors.network'), retryable: true })
      }

      xhr.onabort = () => {
        if (!cleanupRequest()) return
        if (abortedByUserRef.current) commitStreamedMessage()
      }

      xhr.send(JSON.stringify(body))
    },
    [cleanupRequest, clearFirstChunkTimer, commitStreamedMessage, resetRequestState, setMessages],
  )

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return
    const message = input.trim()
    setInput('')
    sendMessage(message)
  }, [input, isLoading, sendMessage])

  const retry = useCallback(() => {
    if (!lastUserMessageRef.current || isLoading) return
    setMessages((m) => {
      if (m.length > 0 && m[m.length - 1].role === 'user' && m[m.length - 1].content === lastUserMessageRef.current) {
        return m.slice(0, -1)
      }
      return m
    })
    sendMessage(lastUserMessageRef.current)
  }, [isLoading, sendMessage, setMessages])

  const submit = useCallback(
    (text: string) => {
      if (isLoading) return
      sendMessage(text)
    },
    [isLoading, sendMessage],
  )

  const reset = useCallback(() => {
    if (xhrRef.current) {
      abortedByUserRef.current = true
      xhrRef.current.abort()
      xhrRef.current = null
    }
    clearFirstChunkTimer()
    threadIdRef.current = null
    hasHydratedOnceRef.current = false
    lastUserMessageRef.current = null
    streamBufferRef.current = ''
    setStreamedContent('')
    setError(null)
    setIsLoading(false)
    useBotStore.getState().clearThread()
  }, [clearFirstChunkTimer])

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    streamedContent,
    error,
    retry,
    stop,
    submit,
    reset,
  }
}
