import { queryOptions, experimental_streamedQuery as streamedQuery, useQuery } from '@tanstack/react-query'

import { authInstance } from '@/lib/axios'

import type { RestChatbotChatRequest } from './schema'

export type UseChatbotStreamOptions = {
  /** Appelé avec le thread_id renvoyé par le serveur (header X-Chatbot-Thread-Uuid) pour continuer la conversation */
  onThreadId?: (threadId: string) => void
}

async function* fetchChatbotStream(params: RestChatbotChatRequest, onThreadId?: (id: string) => void): AsyncIterable<string> {
  const response = await authInstance.post<ReadableStream<Uint8Array>>('/api/v3/ai/chat', params, {
    responseType: 'stream',
    adapter: 'fetch',
  })

  const threadId = response.headers?.['x-chatbot-thread-uuid']
  if (onThreadId && threadId) {
    onThreadId(typeof threadId === 'string' ? threadId : threadId[0])
  }

  const reader = response.data.getReader()
  if (!reader) {
    throw new Error('No reader available')
  }

  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n')
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        try {
          yield JSON.parse(data) as string
        } catch {
          yield data
        }
      }
    }
  }
}

export const useChatbotStream = (params: RestChatbotChatRequest, enabled: boolean, options?: UseChatbotStreamOptions) => {
  return useQuery(
    queryOptions({
      queryKey: ['chatbot', 'response', params],
      queryFn: streamedQuery({
        streamFn: () => fetchChatbotStream(params, options?.onThreadId),
      }),
      enabled,
    }),
  )
}
