import { useCallback, useEffect, useRef, useState } from 'react'

import { classifyXhrCompletion } from './classifyXhrCompletion'
import { createSSEXhr } from './createSSEXhr'
import { processSSEResponseText } from './processSSEResponseText'
import type { SSEStreamError } from './sseTypes'

export type { SSEStreamError }

export type SSEStreamOptions = {
  url: string
  getAuthToken?: () => string | undefined
  firstChunkTimeoutMs?: number
  threadHeaderName?: string
  onThreadHeader?: (uuid: string) => void
  onChunk?: (text: string) => void
  onInStreamError?: (error: { message: string; retryAfter?: number }) => void
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

      const xhr = createSSEXhr(url, getAuthToken?.())
      xhrRef.current = xhr

      firstChunkTimerRef.current = setTimeout(() => {
        if (firstChunkReceivedRef.current || xhrRef.current !== xhr) return
        abortedByUserRef.current = false
        xhr.abort()
        if (!finalize()) return
        callbacksRef.current.onError?.({ kind: 'timeout' })
      }, firstChunkTimeoutMs)

      xhr.onreadystatechange = () => {
        const cb = callbacksRef.current

        if (xhr.readyState >= XMLHttpRequest.HEADERS_RECEIVED && !threadNotifiedRef.current) {
          const tid = xhr.getResponseHeader(threadHeaderName)
          if (tid) {
            threadNotifiedRef.current = true
            cb.onThreadHeader?.(tid)
          }
        }

        const isFinal = xhr.readyState === XMLHttpRequest.DONE
        if (xhr.readyState === XMLHttpRequest.LOADING || isFinal) {
          const { newIndex, newBuffer, chunks, consumedBytes } = processSSEResponseText({
            fullText: xhr.responseText,
            lastProcessedIndex: lastProcessedIndexRef.current,
            lineBuffer: lineBufferRef.current,
            isFinal,
          })
          if (consumedBytes > 0) {
            firstChunkReceivedRef.current = true
            clearFirstChunkTimer()
          }
          lastProcessedIndexRef.current = newIndex
          lineBufferRef.current = newBuffer
          for (const chunk of chunks) {
            if (chunk.kind === 'error') cb.onInStreamError?.({ message: chunk.message, retryAfter: chunk.retryAfter })
            else cb.onChunk?.(chunk.text)
          }
        }

        if (isFinal) {
          if (!finalize()) return
          const outcome = classifyXhrCompletion(xhr, abortedByUserRef.current)
          if (outcome.kind === 'success') cb.onComplete?.()
          else if (outcome.kind === 'http' || outcome.kind === 'network') cb.onError?.(outcome)
          // 'aborted' → silent, dispatch happens via xhr.onabort
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
