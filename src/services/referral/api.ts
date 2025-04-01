import { createRestPaginationSchema } from '@/services/common/schema'
import { ReferralFormErrorThrower } from '@/services/referral/error'
import { ReferralInviteRequestSchema, ReferralPreRegisterRequestSchema, ReferralSchema, ReferralStatisticsSchema } from '@/services/referral/schema'
import { api } from '@/utils/api'
import z from 'zod'

export const referralServiceKey = 'referral'
const base = '/api/v3/referrals'

export const ReferralService = {
  get: api({
    method: 'GET',
    path: `${base}?page_size=300`,
    requestSchema: z.void(),
    responseSchema: createRestPaginationSchema(ReferralSchema),
  }),
  invite: api({
    method: 'POST',
    path: base,
    responseSchema: ReferralSchema,
    requestSchema: ReferralInviteRequestSchema,
    errorThrowers: [ReferralFormErrorThrower],
  }),
  preRegister: api({
    method: 'POST',
    path: base,
    responseSchema: ReferralSchema,
    requestSchema: ReferralPreRegisterRequestSchema,
    errorThrowers: [ReferralFormErrorThrower],
  }),
  statistics: api({
    method: 'GET',
    path: `${base}/statistics`,
    requestSchema: z.void(),
    responseSchema: ReferralStatisticsSchema,
  }),
}
