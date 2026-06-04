import { hasHttpResponse, isHttpSuccess } from './httpStatus'
import type { XhrCompletion } from './sseTypes'

export function classifyXhrCompletion(xhr: XMLHttpRequest, abortedByUser: boolean): XhrCompletion {
  const responded = hasHttpResponse(xhr.status)
  if (responded && isHttpSuccess(xhr.status)) return { kind: 'success' }
  if (responded) return { kind: 'http', status: xhr.status, retryAfterHeader: xhr.getResponseHeader('Retry-After'), responseBody: xhr.responseText }
  if (abortedByUser) return { kind: 'aborted' }
  return { kind: 'network' }
}
