import { postAddressSchema, RestEventAddressSchema } from '@/services/events/schema'
import { errorMessages } from '@/utils/errorMessages'
import { z } from 'zod'

export enum ReferralStatusEnum {
  INVITATION_SENT = 'invitation_sent',
  ACCOUNT_CREATED = 'account_created',
  ADHESION_FINISHED = 'adhesion_finished',
  ADHESION_VIA_OTHER_LINK = 'adhesion_via_other_link',
  REPORTED = 'reported',
}

export enum TypeReferralEnum {
  LINK = 'link',
  INVITATION = 'invitation',
  PREREGISTRATION = 'preregistration',
}

export const ReferralSchema = z.object({
  email_address: z.string().nullable(),
  first_name: z.string(),
  last_name: z.string().nullable(),
  civility: z.string().nullable(),
  nationality: z.string().nullable(),
  phone: z.string().nullable(),
  birthdate: z.string().nullable(),
  referred: z.object({}).nullable(),
  identifier: z.string(),
  type: z.nativeEnum(TypeReferralEnum),
  mode: z.string().nullable(),
  status: z.nativeEnum(ReferralStatusEnum),
  status_label: z.string(),
  uuid: z.string(),
  post_address: RestEventAddressSchema.nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable(),
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
  last_name: z.string().optional(),
  civility: z.string().optional(),
  nationality: z.string().optional(),
  phone: z.string().optional(),
  post_address: postAddressSchema.optional(),
})
export type ReferralPreRegisterRequestType = z.infer<typeof ReferralPreRegisterRequestSchema>

export const ReferralStatisticsSchema = z.object({
  nb_referral_finished: z.number(),
  nb_referral_sent: z.number(),
  nb_referral_reported: z.number(),
})
export type ReferralStatisticsType = z.infer<typeof ReferralStatisticsSchema>

export const ReferralScoreboardItemSchema = z.object({
  referrals_count: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  assembly_code: z.string(),
  assembly_name: z.string(),
  position: z.number(),
  is_current_user: z.boolean().nullish(),
  profile_image: z.string().nullable(),
})

export const ReferralScoreboardSchema = z.object({
  global: z.array(ReferralScoreboardItemSchema),
  global_rank: z.number().nullable(),
  assembly: z.array(ReferralScoreboardItemSchema),
  assembly_rank: z.number().nullable(),
})

export type ReferralScoreboardItemType = z.infer<typeof ReferralScoreboardItemSchema>
export type ReferralScoreboardType = z.infer<typeof ReferralScoreboardSchema>
