import z from 'zod'

import { api } from '@/utils/api'

import * as schemas from './schema'

/** Liste des threads de conversation (GET /ai/threads) */
export const getChatbotThreads = api({
  method: 'GET',
  path: '/api/v3/ai/threads',
  requestSchema: z.void(),
  responseSchema: schemas.RestChatbotThreadsResponseSchema,
  type: 'private',
})
