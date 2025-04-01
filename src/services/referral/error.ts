import { createFormErrorResponseSchema, createFormErrorThrower } from '@/services/common/errors/form-errors'
import { z } from 'zod'

const referralKeys = z.string()
const referralFormErrorSchema = createFormErrorResponseSchema(referralKeys)
export class ReferralFormError extends Error {
  violations: z.infer<typeof referralFormErrorSchema>['violations']
  constructor(public errors: z.infer<typeof referralFormErrorSchema>) {
    super('FormError')
    this.violations = errors.violations
  }
}

export const ReferralFormErrorThrower = createFormErrorThrower(ReferralFormError, referralFormErrorSchema)
