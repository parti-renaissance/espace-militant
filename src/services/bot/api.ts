import z from 'zod'

import clientEnv from '@/config/clientEnv'
import { api } from '@/utils/api'

import * as schemas from './schema'

export const BOT_CHAT_URL = `${clientEnv.API_BASE_URL}/api/v3/ai/chat`
export const BOT_THREAD_HEADER = 'x-chatbot-thread-uuid'
export const BOT_AGENT_ID = 'antiseche'
export const BOT_MESSAGE_MAX_LENGTH = 4000

export function getBotThreadMessages(params: { uuid: string; page?: number }) {
  const { uuid, page } = params
  return api({
    method: 'GET',
    path: `/api/v3/ai/threads/${uuid}/messages`,
    requestSchema: z.object({ page: z.number().optional() }),
    responseSchema: schemas.BotThreadMessagesResponseSchema,
    type: 'private',
  })(page !== undefined ? { page } : {})
}

export const getBotThreadsList = api({
  method: 'GET',
  path: '/api/v3/ai/threads',
  requestSchema: z.object({ page: z.number().optional(), agent: z.string().optional() }),
  responseSchema: schemas.BotThreadsResponseSchema,
  type: 'private',
})
