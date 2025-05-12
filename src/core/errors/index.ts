import { FormError } from '@/services/common/errors/form-errors'

export class ServerTimeoutError extends Error {code = '504' }
export class BadRequestError extends Error {code = '400'}
export class UnauthorizedError extends Error {code = '401'}
export class ForbiddenError extends Error {code = '403'}
export class NotFoundError extends Error {code = '404'}
export class InternalServerError extends Error {code = '500'}
export class RefreshTokenPermanentlyInvalidatedError extends Error {code = '440'}
export class DepartmentNotFoundError extends Error {code = '404'}
export class CacheMissError extends Error {}
export class PublicSubscribeEventFormError extends FormError {}
export class LoginError extends Error {}
export class EventSubscriptionError extends Error {}
export class PhoningSessionNoNumberError extends Error {}
export class PhoningSessionFinishedCampaignError extends Error {}
export class PhonePollAlreadyAnsweredError extends Error {}
export class SignUpFormError extends FormError {}
