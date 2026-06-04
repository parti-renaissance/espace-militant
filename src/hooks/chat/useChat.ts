import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'

import { useUserStore } from '@/store/user-store'

import { classifyHttpError } from './sse/classifyHttpError'
import { useSSEStream } from './sse/useSSEStream'
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
  const [streamedContent, setStreamedContent] = useState('')
  const [error, setError] = useState<ChatError | null>(null)

  const threadIdRef = useRef<string | null>(threadId)
  const lastUserMessageRef = useRef<string | null>(null)
  const streamBufferRef = useRef('')
  const inStreamErrorRef = useRef<{ message: string; retryAfter?: number } | null>(null)

  useEffect(() => {
    threadIdRef.current = threadId
  }, [threadId])

  const onThreadCreatedRef = useRef(onThreadCreated)
  useEffect(() => {
    onThreadCreatedRef.current = onThreadCreated
  }, [onThreadCreated])

  const commitStreamedMessage = useCallback(() => {
    const content = streamBufferRef.current
    if (!content) return
    streamBufferRef.current = ''
    setMessages((m) => [...m, { id: `stream-${Date.now()}`, role: 'assistant', content }])
    setStreamedContent('')
  }, [setMessages])

  const stream = useSSEStream({
    url,
    threadHeaderName,
    getAuthToken: () => useUserStore.getState().user?.accessToken,
    onThreadHeader: (uuid) => {
      threadIdRef.current = uuid
      onThreadCreatedRef.current?.(uuid)
    },
    onChunk: (text) => {
      streamBufferRef.current += text
      setStreamedContent(streamBufferRef.current)
    },
    onInStreamError: (err) => {
      inStreamErrorRef.current = err
    },
    onComplete: () => {
      const inStreamError = inStreamErrorRef.current
      if (inStreamError) {
        commitStreamedMessage()
        if (inStreamError.retryAfter !== undefined) {
          setError({ kind: 'quota', message: inStreamError.message, retryable: false, retryAfterSeconds: inStreamError.retryAfter })
        } else {
          setError({ kind: 'serviceDown', message: 'Le service est momentanément indisponible. Réessayez dans quelques instants.', retryable: true })
        }
      } else if (streamBufferRef.current) {
        commitStreamedMessage()
      } else {
        setError({ kind: 'truncated', message: 'Réponse interrompue. Réessayez pour obtenir une réponse complète.', retryable: true })
      }
    },
    onError: (err) => {
      if (err.kind === 'http') {
        setError(classifyHttpError(err.status, err.retryAfterHeader, err.responseBody))
      } else if (err.kind === 'timeout') {
        setError({ kind: 'timeout', message: 'Le service met trop de temps à répondre. Réessayez.', retryable: true })
      } else {
        setError({ kind: 'network', message: 'Connexion impossible. Vérifiez votre réseau puis réessayez.', retryable: true })
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
      inStreamErrorRef.current = null
      streamBufferRef.current = ''

      setMessages((prev) => [...prev, { id: `local-${Date.now()}`, role: 'user', content: trimmed }])
      setError(null)
      setStreamedContent('')

      const body: Record<string, unknown> = { message: trimmed }
      if (agentId) body.agent_id = agentId
      if (threadIdRef.current) body.thread_id = threadIdRef.current

      stream.start(body)
    },
    [agentId, setMessages, stream],
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

  return {
    input,
    handleInputChange,
    handleSubmit,
    submit,
    retry,
    stop: stream.stop,
    isLoading: stream.isStreaming,
    streamedContent,
    error,
  }
}
