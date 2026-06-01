import { z } from 'zod'

import { createFormErrorResponseSchema, createFormErrorThrower } from '@/services/common/errors/form-errors'

export const signupViolationPathSchema = z.enum(['email', 'first_name', 'postal_code', 'recaptcha'])

export const signupFormErrorSchema = createFormErrorResponseSchema(signupViolationPathSchema)

export type SignupViolationPath = z.infer<typeof signupViolationPathSchema>

export class SignupFormError extends Error {
  violations: z.infer<typeof signupFormErrorSchema>['violations']

  constructor(public errors: z.infer<typeof signupFormErrorSchema>) {
    super('FormError')
    this.violations = errors.violations
  }
}

export const SignupFormErrorThrower = createFormErrorThrower(SignupFormError, signupFormErrorSchema)
