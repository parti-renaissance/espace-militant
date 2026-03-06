import { useCallback, useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import clientEnv from '@/config/clientEnv'
import { useUserStore } from '@/store/user-store'

import * as chatbotApi from './api'
import type { RestChatbotChatRequest } from './schema'

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export type UseCustomChatOptions = {
  /** Thread sélectionné dans la navigation : réinitialise le chat et envoie les prochains messages dans ce thread */
  threadId?: string | null
  /** Appelé quand le backend crée un nouveau thread (header x-chatbot-thread-uuid) pour mettre à jour la nav */
  onThreadCreated?: (threadId: string) => void
}

export type UseCustomChatReturn = {
  messages: ChatMessage[]
  input: string
  handleInputChange: (value: string) => void
  handleSubmit: () => void
  isLoading: boolean
  stop: () => void
  /** Contenu en cours de stream (message assistant en cours de réception) */
  streamedContent: string
  /** Erreur éventuelle (réseau, 4xx/5xx) */
  error: Error | null
}

const CHAT_URL = `${clientEnv.API_BASE_URL}/api/v3/ai/chat`
const THREAD_HEADER = 'x-chatbot-thread-uuid'

/**
 * Parse une ligne SSE "data: ...". Gère le JSON tronqué (retourne null pour réassembler au prochain chunk).
 */
function parseSSEChunk(line: string): string | null {
  const trimmed = line.trim()
  if (!trimmed.startsWith('data: ')) return null
  const data = trimmed.slice(6)
  if (data === '[DONE]' || data === '') return null
  try {
    const parsed = JSON.parse(data) as Record<string, unknown> | string
    if (typeof parsed === 'string') return parsed
    const val = parsed.chunk ?? parsed.message ?? parsed.content ?? ''
    return typeof val === 'string' ? val : String(val)
  } catch {
    // JSON tronqué (chunk coupé au milieu d'un objet) : ne pas afficher de déchet
    const looksLikeIncompleteJson = /^[\s]*[{\[]/.test(data) && !/[}\]]\s*$/.test(data)
    if (looksLikeIncompleteJson) return null
    return data
  }
}

/**
 * Flush le message streamé vers l'historique une seule fois (fin de stream propre).
 */
function flushStreamToMessages(
  streamBuffer: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setStreamedContent: React.Dispatch<React.SetStateAction<string>>,
  isMounted: () => boolean,
) {
  if (!streamBuffer || !isMounted()) return
  setMessages((m) => [...m, { role: 'assistant', content: streamBuffer }])
  setStreamedContent('')
}

export function useCustomChat(options: UseCustomChatOptions = {}): UseCustomChatReturn {
  const { threadId: threadIdProp = null, onThreadCreated } = options
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamedContent, setStreamedContent] = useState('')
  const [error, setError] = useState<Error | null>(null)

  const threadIdRef = useRef<string | null>(threadIdProp ?? null)
  const onThreadCreatedRef = useRef(onThreadCreated)
  useEffect(() => {
    onThreadCreatedRef.current = onThreadCreated
  }, [onThreadCreated])
  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const streamBufferRef = useRef('')
  /** Index du dernier caractère déjà traité dans xhr.responseText (évite .split sur tout le texte) */
  const lastProcessedIndexRef = useRef(0)
  /** Buffer de ligne incomplète (pas de \n final) entre deux chunks */
  const lineBufferRef = useRef('')
  const isMountedRef = useRef(true)
  /** Abort volontaire (bouton Stop) vs perte de connexion (status 0) */
  const abortedByUserRef = useRef(false)

  // Récupération de l'historique du thread sélectionné
  const threadMessagesQuery = useQuery({
    queryKey: ['chatbot-thread-messages', threadIdProp],
    queryFn: () => chatbotApi.getChatbotThreadMessages({ uuid: threadIdProp! }),
    enabled: !!threadIdProp,
  })

  // Synchroniser le thread sélectionné : réinitialiser le chat quand l'utilisateur change de discussion (pas quand on reçoit le nouveau thread créé)
  useEffect(() => {
    const next = threadIdProp ?? null
    if (next === threadIdRef.current) return
    threadIdRef.current = next
    setMessages([])
    setStreamedContent('')
    setError(null)
  }, [threadIdProp])

  // Appliquer l'historique quand on a des messages pour le thread courant et que la liste est vide (changement de thread)
  useEffect(() => {
    if (!threadIdProp || !threadMessagesQuery.data || messages.length > 0) return
    const items = threadMessagesQuery.data.items
    const history: ChatMessage[] = [...items]
      .reverse()
      .filter((m): m is typeof m & { role: 'user' | 'assistant' } => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }))
    setMessages(history)
  }, [threadIdProp, threadMessagesQuery.data, messages.length])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (xhrRef.current) {
        abortedByUserRef.current = true
        xhrRef.current.abort()
        xhrRef.current = null
      }
    }
  }, [])

  const safeSetLoading = useCallback((value: boolean) => {
    if (isMountedRef.current) setIsLoading(value)
  }, [])
  const safeSetError = useCallback((err: Error | null) => {
    if (isMountedRef.current) setError(err)
  }, [])

  const handleInputChange = useCallback((value: string) => {
    setInput(value)
    setError(null)
  }, [])

  const stop = useCallback(() => {
    if (xhrRef.current) {
      abortedByUserRef.current = true
      xhrRef.current.abort()
      xhrRef.current = null
    }
  }, [])

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    abortedByUserRef.current = false
    const userMessage: ChatMessage = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setError(null)
    setStreamedContent('')
    streamBufferRef.current = ''
    lastProcessedIndexRef.current = 0
    lineBufferRef.current = ''
    setIsLoading(true)

    const body: RestChatbotChatRequest = {
      message: trimmed,
      ...(threadIdRef.current ? { thread_id: threadIdRef.current } : {}),
    }

    const accessToken = useUserStore.getState().user?.accessToken
    const xhr = new XMLHttpRequest()
    xhrRef.current = xhr

    xhr.open('POST', CHAT_URL, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Accept', 'text/event-stream')
    if (accessToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState >= 2) {
        const threadUuid = xhr.getResponseHeader(THREAD_HEADER)
        if (threadUuid) {
          threadIdRef.current = threadUuid
          onThreadCreatedRef.current?.(threadUuid)
        }
      }

      if (xhr.readyState === 3 || xhr.readyState === 4) {
        const fullText = xhr.responseText
        const from = lastProcessedIndexRef.current
        if (from < fullText.length) {
          const newPart = fullText.substring(from)
          lastProcessedIndexRef.current = fullText.length
          lineBufferRef.current += newPart
        }

        const lines = lineBufferRef.current.split('\n')
        const endIndex = xhr.readyState === 4 ? lines.length : Math.max(0, lines.length - 1)

        for (let i = 0; i < endIndex; i++) {
          const chunk = parseSSEChunk(lines[i])
          if (chunk) streamBufferRef.current += chunk
        }

        if (xhr.readyState === 4) {
          lineBufferRef.current = ''
        } else {
          lineBufferRef.current = lines[lines.length - 1] ?? ''
        }

        if (isMountedRef.current) setStreamedContent(streamBufferRef.current)
      }

      if (xhr.readyState === 4) {
        xhrRef.current = null
        safeSetLoading(false)

        if (xhr.status >= 200 && xhr.status < 300) {
          flushStreamToMessages(streamBufferRef.current, setMessages, setStreamedContent, () => isMountedRef.current)
          streamBufferRef.current = ''
        } else if (xhr.status !== 0) {
          safeSetError(new Error(xhr.responseText || `HTTP ${xhr.status}`))
        } else if (!abortedByUserRef.current) {
          safeSetError(new Error('Connexion perdue ou requête interrompue'))
        }
      }
    }

    xhr.onerror = () => {
      xhrRef.current = null
      safeSetLoading(false)
      safeSetError(new Error('Erreur réseau'))
    }

    xhr.onabort = () => {
      xhrRef.current = null
      safeSetLoading(false)
      abortedByUserRef.current = true
      flushStreamToMessages(streamBufferRef.current, setMessages, setStreamedContent, () => isMountedRef.current)
      streamBufferRef.current = ''
    }

    xhr.send(JSON.stringify(body))
  }, [input, isLoading, safeSetLoading, safeSetError])

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    streamedContent,
    error,
  }
}

export const useGetPaginatedChatbotThreads = () => {
  return useInfiniteQuery({
    queryKey: ['chatbot-threads'],
    queryFn: ({ pageParam = 1 }) => chatbotApi.getChatbotThreadsList({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.metadata.current_page < lastPage.metadata.last_page ? lastPage.metadata.current_page + 1 : undefined),
    getPreviousPageParam: (firstPage) => (firstPage.metadata.current_page > 1 ? firstPage.metadata.current_page - 1 : undefined),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}
