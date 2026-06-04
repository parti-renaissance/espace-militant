import clientEnv from '@/config/clientEnv'

export const BOT_CHAT_URL = `${clientEnv.API_BASE_URL}/api/v3/ai/chat`
export const BOT_THREAD_HEADER = 'x-chatbot-thread-uuid'
export const BOT_AGENT_ID = 'antiseche'
export const BOT_MESSAGE_MAX_LENGTH = 4000
