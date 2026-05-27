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

export const BotThreadMessageItemSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  date: z.string(),
  uuid: z.string().uuid(),
})
export type BotThreadMessageItem = z.infer<typeof BotThreadMessageItemSchema>

export const BotThreadMessagesMetadataSchema = z.object({
  total_items: z.number(),
  items_per_page: z.number(),
  count: z.number(),
  current_page: z.number(),
  last_page: z.number(),
})

export const BotThreadMessagesResponseSchema = z.object({
  metadata: BotThreadMessagesMetadataSchema,
  items: z.array(BotThreadMessageItemSchema),
})
export type BotThreadMessagesResponse = z.infer<typeof BotThreadMessagesResponseSchema>

export const BotThreadItemSchema = z.object({
  title: z.string().nullable(),
  uuid: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type BotThreadItem = z.infer<typeof BotThreadItemSchema>

export const BotThreadsResponseSchema = z.object({
  metadata: BotThreadMessagesMetadataSchema,
  items: z.array(BotThreadItemSchema),
})
export type BotThreadsResponse = z.infer<typeof BotThreadsResponseSchema>
