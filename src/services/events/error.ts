import { z } from 'zod'
import { createFormErrorResponseSchema, createFormErrorThrower, FormError } from '../common/errors/form-errors'
import { propertyPathPostEventSchema } from './schema'

export class PublicEventSubscriptionFormError extends FormError {}
export const publicEventSubscriptionFormErrorThrower = createFormErrorThrower(PublicEventSubscriptionFormError)

const eventPostFormErrorSchema = createFormErrorResponseSchema(propertyPathPostEventSchema)
export class eventPostFormError extends Error {
  violations: z.infer<typeof eventPostFormErrorSchema>['violations']
  constructor(public errors: z.infer<typeof eventPostFormErrorSchema>) {
    super('FormError')
    this.violations = errors.violations
  }
}
export const eventPostFormErrorThrower = createFormErrorThrower(eventPostFormError, eventPostFormErrorSchema)
