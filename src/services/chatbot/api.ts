import * as schemas from './schema'
import { api } from '@/utils/api'

export const startChatbot = (params: schemas.RestChatbotStartRequest) =>
  api({
    method: 'POST',
    path: 'api/v3/chatbot/start',
    requestSchema: schemas.RestChatbotStartRequestSchema,
    responseSchema: schemas.RestChatbotStartResponseSchema,
    type: 'private',
  })(params)
