import { RestEventAddressSchema } from '@/services/events/schema'
import { errorMessages } from '@/utils/errorMessages'
import { z } from 'zod'

export const ReferralSchema = z.object({
  email_address: z.string(),
  first_name: z.string(),
  last_name: z.null(),
  civility: z.null(),
  nationality: z.null(),
  phone: z.null(),
  birthdate: z.null(),
  referred: z.null(),
  identifier: z.string(),
  type: z.string(),
  mode: z.string(),
  status: z.string(),
  uuid: z.string(),
  post_address: RestEventAddressSchema,
})
export type ReferralType = z.infer<typeof ReferralSchema>

export const ReferralInviteRequestSchema = z.object({
  email_address: z.string().email(),
  first_name: z.string().min(1, errorMessages.emptyField),
})
export type ReferralInviteRequestType = z.infer<typeof ReferralInviteRequestSchema>

export const ReferralPreRegisterRequestSchema = z.object({
  email_address: z.string().email(errorMessages.email),
  first_name: z.string().min(1, errorMessages.emptyField),
  last_name: z.null().optional(),
  civility: z.null().optional(),
  nationality: z.null().optional(),
  phone: z.null().optional(),
})
export type ReferralPreRegisterRequestType = z.infer<typeof ReferralPreRegisterRequestSchema>
