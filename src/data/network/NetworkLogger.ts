import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { AxiosError } from 'axios'

export const logTypeError = (error: TypeError) => {
  ErrorMonitor.log('[NetworkLogger] Type error', {
    error: error.message,
  })
}

export const logTimeoutError = (error: AxiosError) => {
  ErrorMonitor.log('[NetworkLogger] Timeout error', {
    request: {
      url: error.request.url,
      headers: JSON.stringify(error.request.headers),
      method: error.request.method,
    },
  })
}

export const logHttpError = async (error: AxiosError, title?: string) => {
  const body = await error.response?.data
  ErrorMonitor.log(
    title ?? `[NetworkLogger] HTTP error ${error.response?.status}`,
    {
      request: {
        url: error.request.url,
        headers: JSON.stringify(error.request.headers),
        method: error.request.method,
      },
      response: {
        status: error.response?.status,
        headers: JSON.stringify(error.response?.headers),
        body: JSON.stringify(body),
      },
    },
    error.response?.status !== 401 && error.response?.status !== 403,
  )
}

export const logDefaultError = (error: Error) => {
  ErrorMonitor.log('[NetworkLogger] Uncatched error', {
    error: error.message,
  })
}
