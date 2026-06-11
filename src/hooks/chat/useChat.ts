import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'

import { refreshOn401 } from '@/lib/axios'
import { useUserStore } from '@/store/user-store'

import { chatErrors } from './chatErrors'
import { classifyHttpError } from './sse/classifyHttpError'
import { useSSEStream } from './sse/useSSEStream'
import { useTypewriter } from './useTypewriter'
import type { ChatError, ChatMessage } from './types'

export type UseChatOptions = {
  url: string
  agentId?: string
  threadHeaderName?: string
  threadId: string | null
  onThreadCreated?: (uuid: string) => void
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
}

export type UseChatReturn = {
  input: string
  handleInputChange: (value: string) => void
  handleSubmit: () => void
  submit: (text: string) => void
  retry: () => void
  stop: () => void
  isLoading: boolean
  streamedContent: string
  error: ChatError | null
}

export function useChat({ url, agentId, threadHeaderName, threadId, onThreadCreated, setMessages }: UseChatOptions): UseChatReturn {
  const [input, setInput] = useState('')
  const [error, setError] = useState<ChatError | null>(null)
  const { display: streamedContent, busy, push, finish, stop: stopTyping, reset } = useTypewriter()

  const threadIdRef = useRef<string | null>(threadId)
  const lastUserMessageRef = useRef<string | null>(null)
  const hasTriedRefreshRef = useRef(false)
  const inStreamErrorRef = useRef<{ message: string; retryAfter?: number } | null>(null)

  useEffect(() => {
    threadIdRef.current = threadId
  }, [threadId])

  const onThreadCreatedRef = useRef(onThreadCreated)
  useEffect(() => {
    onThreadCreatedRef.current = onThreadCreated
  }, [onThreadCreated])

  const buildBody = useCallback(
    (message: string) => {
      const body: Record<string, unknown> = { message }
      if (agentId) body.agent_id = agentId
      if (threadIdRef.current) body.thread_id = threadIdRef.current
      return body
    },
    [agentId],
  )

  const appendAssistant = useCallback(
    (content: string) => {
      if (content) setMessages((m) => [...m, { id: `stream-${Date.now()}`, role: 'assistant', content }])
    },
    [setMessages],
  )

  const stream = useSSEStream({
    url,
    threadHeaderName,
    getAuthToken: () => useUserStore.getState().user?.accessToken,
    onThreadHeader: (uuid) => {
      threadIdRef.current = uuid
      onThreadCreatedRef.current?.(uuid)
    },
    onChunk: (text) => push(text),
    onInStreamError: (err) => {
      inStreamErrorRef.current = err
    },
    onComplete: () => {
      const inStreamError = inStreamErrorRef.current
      finish((content) => {
        appendAssistant(content)
        if (inStreamError) {
          setError(inStreamError.retryAfter !== undefined ? chatErrors.quota(inStreamError.message, inStreamError.retryAfter) : chatErrors.serviceDown())
        } else if (!content) {
          setError(chatErrors.truncated())
        }
      })
    },
    onError: (err) => {
      if (err.kind === 'http' && err.status === 401 && !hasTriedRefreshRef.current) {
        hasTriedRefreshRef.current = true
        refreshOn401(useUserStore.getState().user?.accessToken).then((refreshed) => {
          if (refreshed && lastUserMessageRef.current) stream.start(buildBody(lastUserMessageRef.current))
          else setError(classifyHttpError(401, null, null))
        })
        return
      }
      setError(chatErrors.fromStream(err))
    },
    onAbort: () => {
      appendAssistant(stopTyping())
    },
  })

  const isLoading = stream.isStreaming || busy

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return

      lastUserMessageRef.current = trimmed
      hasTriedRefreshRef.current = false
      inStreamErrorRef.current = null
      reset()

      setMessages((prev) => [...prev, { id: `local-${Date.now()}`, role: 'user', content: trimmed }])
      setError(null)

      stream.start(buildBody(trimmed))
    },
    [buildBody, reset, setMessages, stream],
  )

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value)
      if (error) setError(null)
    },
    [error],
  )

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return
    const message = input.trim()
    setInput('')
    sendMessage(message)
  }, [input, sendMessage, isLoading])

  const retry = useCallback(() => {
    if (!lastUserMessageRef.current || isLoading) return
    setMessages((m) => {
      if (m.length > 0 && m[m.length - 1].role === 'user' && m[m.length - 1].content === lastUserMessageRef.current) {
        return m.slice(0, -1)
      }
      return m
    })
    sendMessage(lastUserMessageRef.current)
  }, [sendMessage, setMessages, isLoading])

  const submit = useCallback(
    (text: string) => {
      if (isLoading) return
      sendMessage(text)
    },
    [sendMessage, isLoading],
  )

  const handleStop = useCallback(() => {
    if (stream.isStreaming) stream.stop()
    else if (busy) appendAssistant(stopTyping())
  }, [stream, busy, appendAssistant, stopTyping])

  return {
    input,
    handleInputChange,
    handleSubmit,
    submit,
    retry,
    stop: handleStop,
    isLoading,
    streamedContent,
    error,
  }
}
