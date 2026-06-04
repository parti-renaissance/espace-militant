import z from 'zod'

import type { ChatError, ChatErrorKind, ChatMessage } from '@/hooks/chat/types'

export const RestBotChatRequestSchema = z.object({
  message: z.string(),
  thread_id: z.string().optional(),
  agent_id: z.string().optional(),
})
export type RestBotChatRequest = z.infer<typeof RestBotChatRequestSchema>

export type BotChatMessage = ChatMessage
export type BotChatErrorKind = ChatErrorKind
export type BotChatError = ChatError
