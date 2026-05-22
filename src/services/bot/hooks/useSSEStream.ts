import { useCallback, useEffect, useRef, useState } from 'react'

import { hasHttpResponse, isHttpSuccess } from '../utils/httpStatus'
import { parseSSEChunk } from '../utils/parseSSEChunk'

export type SSEStreamError =
  | { kind: 'http'; status: number; retryAfterHeader: string | null }
  | { kind: 'timeout' }
  | { kind: 'network' }

export type SSEStreamOptions = {
  url: string
  getAuthToken?: () => string | undefined
  firstChunkTimeoutMs?: number
  threadHeaderName?: string
  onThreadHeader?: (uuid: string) => void
  onChunk?: (text: string) => void
  onInStreamError?: (message: string) => void
  onComplete?: () => void
  onError?: (error: SSEStreamError) => void
  onAbort?: () => void
}

export type SSEStreamReturn = {
  start: (body: unknown) => void
  stop: () => void
  isStreaming: boolean
}

const DEFAULT_FIRST_CHUNK_TIMEOUT_MS = 30_000
const DEFAULT_THREAD_HEADER = 'x-chatbot-thread-uuid'

export function useSSEStream(opts: SSEStreamOptions): SSEStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false)

  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const lastProcessedIndexRef = useRef(0)
  const lineBufferRef = useRef('')
  const isMountedRef = useRef(true)
  const abortedByUserRef = useRef(false)
  const firstChunkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstChunkReceivedRef = useRef(false)
  const threadNotifiedRef = useRef(false)

  const callbacksRef = useRef(opts)
  useEffect(() => {
    callbacksRef.current = opts
  })

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

  const finalize = useCallback((): boolean => {
    clearFirstChunkTimer()
    xhrRef.current = null
    if (!isMountedRef.current) return false
    setIsStreaming(false)
    return true
  }, [clearFirstChunkTimer])

  const start = useCallback(
    (body: unknown) => {
      const { url, getAuthToken, firstChunkTimeoutMs = DEFAULT_FIRST_CHUNK_TIMEOUT_MS, threadHeaderName = DEFAULT_THREAD_HEADER } = callbacksRef.current

      abortedByUserRef.current = false
      firstChunkReceivedRef.current = false
      threadNotifiedRef.current = false
      lastProcessedIndexRef.current = 0
      lineBufferRef.current = ''
      setIsStreaming(true)

      const xhr = new XMLHttpRequest()
      xhrRef.current = xhr

      xhr.open('POST', url, true)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.setRequestHeader('Accept', 'text/event-stream')
      const token = getAuthToken?.()
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      firstChunkTimerRef.current = setTimeout(() => {
        if (firstChunkReceivedRef.current || xhrRef.current !== xhr) return
        abortedByUserRef.current = false
        xhr.abort()
        if (!finalize()) return
        callbacksRef.current.onError?.({ kind: 'timeout' })
      }, firstChunkTimeoutMs)

      xhr.onreadystatechange = () => {
        const headersReceived = xhr.readyState >= XMLHttpRequest.HEADERS_RECEIVED
        const bodyArriving = xhr.readyState === XMLHttpRequest.LOADING || xhr.readyState === XMLHttpRequest.DONE
        const requestDone = xhr.readyState === XMLHttpRequest.DONE

        if (headersReceived && !threadNotifiedRef.current) {
          const headerThreadId = xhr.getResponseHeader(threadHeaderName)
          if (headerThreadId) {
            threadNotifiedRef.current = true
            callbacksRef.current.onThreadHeader?.(headerThreadId)
          }
        }

        if (bodyArriving) {
          const fullText = xhr.responseText
          const from = lastProcessedIndexRef.current
          if (from < fullText.length) {
            firstChunkReceivedRef.current = true
            clearFirstChunkTimer()
            lastProcessedIndexRef.current = fullText.length
            lineBufferRef.current += fullText.substring(from)
          }

          const lines = lineBufferRef.current.split('\n')
          const endIndex = requestDone ? lines.length : Math.max(0, lines.length - 1)
          for (let i = 0; i < endIndex; i++) {
            const chunk = parseSSEChunk(lines[i])
            if (!chunk) continue
            if (chunk.kind === 'error') {
              callbacksRef.current.onInStreamError?.(chunk.message)
            } else {
              callbacksRef.current.onChunk?.(chunk.text)
            }
          }

          lineBufferRef.current = requestDone ? '' : (lines[lines.length - 1] ?? '')
        }

        if (requestDone) {
          if (!finalize()) return

          const responded = hasHttpResponse(xhr.status)
          const isSuccess = responded && isHttpSuccess(xhr.status)
          const isHttpError = responded && !isSuccess
          const isNetworkError = !responded && !abortedByUserRef.current

          if (isSuccess) {
            callbacksRef.current.onComplete?.()
          } else if (isHttpError) {
            callbacksRef.current.onError?.({
              kind: 'http',
              status: xhr.status,
              retryAfterHeader: xhr.getResponseHeader('Retry-After'),
            })
          } else if (isNetworkError) {
            callbacksRef.current.onError?.({ kind: 'network' })
          }
        }
      }

      xhr.onerror = () => {
        if (!finalize()) return
        callbacksRef.current.onError?.({ kind: 'network' })
      }

      xhr.onabort = () => {
        if (!finalize()) return
        if (abortedByUserRef.current) callbacksRef.current.onAbort?.()
      }

      xhr.send(JSON.stringify(body))
    },
    [clearFirstChunkTimer, finalize],
  )

  const stop = useCallback(() => {
    if (xhrRef.current) {
      abortedByUserRef.current = true
      xhrRef.current.abort()
      xhrRef.current = null
    }
    clearFirstChunkTimer()
  }, [clearFirstChunkTimer])

  return { start, stop, isStreaming }
}
