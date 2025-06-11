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

export const genericErrorThrower = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      const { success, data } = GenericErrorResponseSchema.safeParse(error.response.data)

      if (success) {
        throw new GenericResponseError(data)
      }
    }

    if (error.code === 'ECONNABORTED') {
      logTimeoutError(error)
      throw new ServerTimeoutError(error.message)
    } else if (error.response) {
      logHttpError(error)

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
      logDefaultError(error)
      return error
    } else {
      logDefaultError(error)
      throw error
    }
  } else if (error instanceof TypeError && error.message === 'Network request failed') {
    logTypeError(error)
    throw new ServerTimeoutError(error.message)
  } else if (error instanceof Error) {
    logDefaultError(error)
  }
  return error
}
