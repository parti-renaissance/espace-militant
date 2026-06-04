import z from 'zod'

import { api } from '@/utils/api'

import * as schemas from './schema'

export const CHATBOT_AGENT_ID = 'chatbot'

/** Liste des threads de conversation (GET /ai/threads) */
export const getChatbotThreadsList = api({
  method: 'GET',
  path: '/api/v3/ai/threads',
  requestSchema: z.object({ page: z.number(), agent: z.string().optional() }),
  responseSchema: schemas.RestChatbotThreadsResponseSchema,
  type: 'private',
})

/** Historique des messages d'un thread (GET /ai/threads/:uuid/messages) */
export function getChatbotThreadMessages(params: { uuid: string; page?: number }) {
  const { uuid, page } = params
  return api({
    method: 'GET',
    path: `/api/v3/ai/threads/${uuid}/messages`,
    requestSchema: z.object({ page: z.number().optional() }),
    responseSchema: schemas.RestChatbotThreadMessagesResponseSchema,
    type: 'private',
  })(page !== undefined ? { page } : {})
}
