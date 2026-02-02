import z from 'zod'

export const ChatbotMessageSchema = z.object({
  role: z.string(),
  content: z.string(),
})

export const RestChatbotStartRequestSchema = z.object({
  messages: z.array(ChatbotMessageSchema),
})
export type RestChatbotStartRequest = z.infer<typeof RestChatbotStartRequestSchema>

export const RestChatbotStartResponseSchema = z.object({
  data: z.string(),
})
export type RestChatbotStartResponse = z.infer<typeof RestChatbotStartResponseSchema>
