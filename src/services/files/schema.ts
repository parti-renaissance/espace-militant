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

export type RestPostMessageResponse = z.infer<typeof RestPostMessageResponseSchema>

const RestUploadedFileAuthorSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
})

export const RestUploadedFileItemSchema = z.object({
  original_name: z.string(),
  mime_type: z.string(),
  author: RestUploadedFileAuthorSchema,
  created_at: z.string(),
  size: z.string(),
  url: z.string().url(),
})

export const RestUploadedFileListResponseSchema = createRestPaginationSchema(RestUploadedFileItemSchema)

export type RestUploadedFileAuthor = z.infer<typeof RestUploadedFileAuthorSchema>
export type RestUploadedFileItem = z.infer<typeof RestUploadedFileItemSchema>
export type RestUploadedFileListResponse = z.infer<typeof RestUploadedFileListResponseSchema>
