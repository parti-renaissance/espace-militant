import z from 'zod'

export const RestPostMessageRequestSchema = z.object({
  type: z.string(),
  label: z.string(),
  subject: z.string(),
  content: z.string(),
  json_content: z.string(),
})

export type RestPostMessageRequest = z.infer<typeof RestPostMessageRequestSchema>

export const RestPostMessageResponseSchema = z.object({
  uuid: z.string(),
  author: z.object({
    email_address: z.string().email(),
    uuid: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  label: z.string(),
  subject: z.string(),
  status: z.string(),
  recipient_count: z.number(),
  source: z.string(),
  synchronized: z.boolean(),
  preview_link: z.string().nullable(),
})

export const RestGetMessageContentResponseSchema = z.object({
  uuid: z.string(),
  content: z.string(),
  subject: z.string(),
  json_content: z.string(),
})

export type RestGetMessageContentResponse = z.infer<typeof RestGetMessageContentResponseSchema>

export type RestPostMessageResponse = z.infer<typeof RestPostMessageResponseSchema>
