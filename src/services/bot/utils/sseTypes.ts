export type SSEStreamError =
  | { kind: 'http'; status: number; retryAfterHeader: string | null }
  | { kind: 'timeout' }
  | { kind: 'network' }

export type XhrCompletion = { kind: 'success' } | { kind: 'aborted' } | SSEStreamError
