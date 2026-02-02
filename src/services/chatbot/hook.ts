import * as schemas from './schema'
import { authInstance } from '@/lib/axios'
import { experimental_streamedQuery as streamedQuery, queryOptions, useQuery } from '@tanstack/react-query'

async function* fetchChatbotStream(params: schemas.RestChatbotStartRequest): AsyncIterable<string> {
    const response = await authInstance.post<ReadableStream<Uint8Array>>('/api/v3/chatbot/start', params, {
        responseType: 'stream',
        adapter: 'fetch',
    })

    const reader = response.data.getReader()
    if (!reader) {
        throw new Error('No reader available')
    }

    const decoder = new TextDecoder()
    
    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        // console.log("chunk", chunk)
        const lines = chunk.split('\n')
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6)
                 try {
                    yield JSON.parse(data)
                 } catch (e) {
                    yield data
                 }
            }
        }
    }
}

export const useChatbotStream = (params: schemas.RestChatbotStartRequest, enabled: boolean) => {
    return useQuery(
        queryOptions({
            queryKey: ['chatbot', 'response', params],
            queryFn: streamedQuery({
                queryFn: () => fetchChatbotStream(params),
            }),
            enabled,
        })
    )
}
