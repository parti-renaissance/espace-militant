import { z } from 'zod'
import { activistTagSchema } from '@/data/Activist/schema'

export const ScanTicketRequestSchema = z.object({
  uuid: z.string().min(1, 'UUID requis')
})

export const UserSchema = z.object({
  public_id: z.string().nullable(),
  image_url: z.string().nullable(),
  civility: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  tags: z.array(activistTagSchema).optional(),
  age: z.number().optional()
})

export const ScanHistoryItemSchema = z.object({
  date: z.string(),
  name: z.string(),
  public_id: z.string()
})

export const ScanTicketResponseSchema = z.object({
  uuid: z.string(),
  status: z.object({
    code: z.string(),
    label: z.string(),
    type: z.string(),
    message: z.string()
  }),
  type: z.object({
    color: z.string(),
    label: z.string()
  }).nullish(),
  alert: z.string().nullish(),
  user: UserSchema.nullish(),
  visit_day: z.string().optional(),
  transport: z.string().optional(),
  accommodation: z.string().nullish(),
  scan_history: z.array(ScanHistoryItemSchema).nullish()
})

export type ScanTicketRequest = z.infer<typeof ScanTicketRequestSchema>
export type ScanTicketResponse = z.infer<typeof ScanTicketResponseSchema>
export type User = z.infer<typeof UserSchema>
export type ScanHistoryItem = z.infer<typeof ScanHistoryItemSchema>
