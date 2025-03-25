import { ReferralInviteRequestSchema, ReferralPreRegisterRequestSchema, ReferralSchema } from '@/services/referral/schema'
import { api } from '@/utils/api'
import z from 'zod'

export const referralServiceKey = 'referral'
export const ReferralService = {
  get: api({
    method: 'GET',
    path: '/api/v3/referrals',
    requestSchema: z.void(),
    responseSchema: ReferralSchema,
  }),
  invite: api({
    method: 'POST',
    path: '/api/v3/referrals',
    responseSchema: ReferralSchema,
    requestSchema: ReferralInviteRequestSchema,
  }),
  preRegister: api({
    method: 'POST',
    path: '/api/v3/referrals',
    responseSchema: ReferralSchema,
    requestSchema: ReferralPreRegisterRequestSchema,
  }),
}
