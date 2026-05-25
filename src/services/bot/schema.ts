import z from 'zod'

export const RestBotChatRequestSchema = z.object({
  message: z.string(),
  thread_id: z.string().optional(),
  agent_id: z.string().optional(),
})
export type RestBotChatRequest = z.infer<typeof RestBotChatRequestSchema>

export type BotChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type BotChatErrorKind = 'network' | 'auth' | 'forbidden' | 'quota' | 'serviceDown' | 'timeout' | 'truncated' | 'unknown'

export type BotChatError = {
  kind: BotChatErrorKind
  message: string
  retryable: boolean
  retryAfterSeconds?: number
}

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
