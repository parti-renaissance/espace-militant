import { FormError } from '@/services/common/errors/form-errors'

export interface DetailedAPIErrorPayload {
    title?: string
    detail?: string
    status?: number
    type?: string
    key?: string
  }
  
export class DetailedAPIError extends Error {
    title?: string
    detail?: string
    status?: number
    type?: string
    key?: string
  
    constructor(payload: DetailedAPIErrorPayload) {
      super(payload.detail)
      this.name = new.target.name
      this.title = payload?.title
      this.detail = payload?.detail
      this.status = payload?.status
      this.type = payload?.type
      this.key = payload?.key
    }
  }

export class ServerTimeoutError extends Error {code = '504' }
export class BadRequestError extends DetailedAPIError {code = '400'}
export class UnauthorizedError extends DetailedAPIError {code = '401'}
export class ForbiddenError extends DetailedAPIError {code = '403'}
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
