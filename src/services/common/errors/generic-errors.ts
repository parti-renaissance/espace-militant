import { BadRequestError, DetailedAPIErrorPayload, ForbiddenError, InternalServerError, NotFoundError, ServerTimeoutError, UnauthorizedError } from '@/core/errors'
import { logDefaultError, logHttpError, logTimeoutError, logTypeError } from '@/data/network/NetworkLogger'
import axios from 'axios'
import { z } from 'zod'

export const GenericErrorResponseSchema = z.object({
  message: z.string(),
})

export class GenericResponseError extends Error {
  message: z.infer<typeof GenericErrorResponseSchema>['message']
  constructor(public errors: z.infer<typeof GenericErrorResponseSchema>) {
    super('FormError')
    this.message = errors.message
  }
}

const genericErrorHandler = (error: unknown, shouldLog: boolean) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      const { success, data } = GenericErrorResponseSchema.safeParse(error?.response?.data)

      if (success) {
        throw new GenericResponseError(data)
      }
    }

    if (error.code === 'ECONNABORTED') {
      if (shouldLog) {
        logTimeoutError(error)
      }
      throw new ServerTimeoutError(error.message)
    } else if (error.response) {
      if (shouldLog) {
        void logHttpError(error)
      }

      const payload = error?.response?.data as DetailedAPIErrorPayload

      switch (error.response.status) {
        case 400:
          throw new BadRequestError(payload)
        case 401:
          throw new UnauthorizedError(payload)
        case 403:
          throw new ForbiddenError(payload)
        case 404:
          throw new NotFoundError(error.message)
        case 500:
          throw new InternalServerError(error.message)
        default:
          throw error
      }
    } else if (error.message === 'Network Error') {
      if (shouldLog) {
        logDefaultError(error)
      }
      return error
    } else {
      if (shouldLog) {
        logDefaultError(error)
      }
      throw error
    }
  } else if (error instanceof TypeError && error.message === 'Network request failed') {
    if (shouldLog) {
      logTypeError(error)
    }
    throw new ServerTimeoutError(error.message)
  } else if (error instanceof Error) {
    if (shouldLog) {
      logDefaultError(error)
    }
  }
  return error
}

/** Maps and logs HTTP errors (default API pipeline). */
export const genericErrorThrower = (error: unknown) => genericErrorHandler(error, true)

/** Maps HTTP errors without Sentry logging — use when a feature layer logs (e.g. action mutations). */
export const genericErrorMapper = (error: unknown) => genericErrorHandler(error, false)
