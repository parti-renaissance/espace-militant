import z from 'zod'
import { createRestPaginationSchema } from '@/services/common/schema'

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

export const RestMessageListItemSchema = z.object({
  author: z.object({
    uuid: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  label: z.string(),
  subject: z.string(),
  status: z.string(),
  sent_at: z.string().nullable(),
  recipient_count: z.number(),
  source: z.string(),
  uuid: z.string(),
  created_at: z.string(),
  synchronized: z.boolean(),
  from_name: z.string(),
  statistics: z.object({
    sent: z.number(),
    opens: z.number(),
    open_rate: z.number(),
    clicks: z.number(),
    click_rate: z.number(),
    unsubscribe: z.number(),
    unsubscribe_rate: z.number(),
  }),
  preview_link: z.string(),
})

export const RestMessageListResponseSchema = createRestPaginationSchema(RestMessageListItemSchema)

export type RestMessageListItem = z.infer<typeof RestMessageListItemSchema>
export type RestMessageListResponse = z.infer<typeof RestMessageListResponseSchema>

export const RestMessageCountRecipientsResponseSchema = z.object({
  push: z.number(),
  email: z.number(),
  push_email: z.number(),
  only_push: z.number(),
  only_email: z.number(),
  contacts: z.number(),
  total: z.number(),
})

export type RestMessageCountRecipientsResponse = z.infer<typeof RestMessageCountRecipientsResponseSchema>
