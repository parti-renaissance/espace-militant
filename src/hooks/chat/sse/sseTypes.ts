export type SSEStreamError =
  | { kind: 'http'; status: number; retryAfterHeader: string | null; responseBody: string | null }
  | { kind: 'timeout' }
  | { kind: 'network' }

export type XhrCompletion = { kind: 'success' } | { kind: 'aborted' } | SSEStreamError
