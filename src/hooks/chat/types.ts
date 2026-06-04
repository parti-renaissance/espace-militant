export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type ChatErrorKind = 'network' | 'auth' | 'forbidden' | 'quota' | 'serviceDown' | 'timeout' | 'truncated' | 'unknown'

export type ChatError = {
  kind: ChatErrorKind
  message: string
  retryable: boolean
  retryAfterSeconds?: number
}
