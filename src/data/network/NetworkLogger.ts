import axios, { AxiosError } from 'axios'

import { ErrorMonitor } from '@/utils/ErrorMonitor'

const requestContext = (error: AxiosError) => ({
  request: {
    url: error.config?.url,
    method: error.config?.method,
  },
})

export const logTypeError = (error: TypeError) => {
  ErrorMonitor.logError({
    domain: 'network',
    message: 'Network type error',
    error,
    extra: { error: error.message },
  })
}

export const logTimeoutError = (error: AxiosError) => {
  ErrorMonitor.logError({
    domain: 'network',
    message: 'Network timeout',
    error,
    extra: requestContext(error),
  })
}

export const logHttpError = async (error: AxiosError, title?: string) => {
  const status = error.response?.status
  if (status === 401 || status === 403) {
    return
  }

  const body = await error.response?.data
  ErrorMonitor.logError({
    domain: 'network',
    message: title ?? `HTTP error ${status}`,
    error,
    extra: {
      ...requestContext(error),
      response: {
        status,
        body: typeof body === 'string' ? body : JSON.stringify(body),
      },
    },
  })
}

export const logDefaultError = (error: Error) => {
  if (error.message === 'Network Error') {
    ErrorMonitor.log('[NetworkLogger] Network error (offline)', { error: error.message })
    return
  }

  const extra: Record<string, unknown> = { error: error.message }
  if (axios.isAxiosError(error)) {
    extra.httpStatus = error.response?.status
    extra.httpUrl = error.config?.url
    extra.httpMethod = error.config?.method
  }

  ErrorMonitor.logError({
    domain: 'network',
    message: 'Network uncaught error',
    error,
    extra,
  })
}
