import { FormError } from '@/services/common/errors/form-errors'

export class ServerTimeoutError extends Error {}
export class BadRequestError extends Error {}
export class UnauthorizedError extends Error {}
export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}
export class InternalServerError extends Error {}
export class RefreshTokenPermanentlyInvalidatedError extends Error {}
export class DepartmentNotFoundError extends Error {}
export class CacheMissError extends Error {}
export class PublicSubscribeEventFormError extends FormError {}
export class LoginError extends Error {}
export class EventSubscriptionError extends Error {}
export class PhoningSessionNoNumberError extends Error {}
export class PhoningSessionFinishedCampaignError extends Error {}
export class PhonePollAlreadyAnsweredError extends Error {}
export class SignUpFormError extends FormError {}
