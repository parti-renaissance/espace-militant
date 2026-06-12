import { classifyHttpError } from './sse/classifyHttpError'
import type { SSEStreamError } from './sse/useSSEStream'
import type { ChatError } from './types'

export const chatErrors = {
  serviceDown: (): ChatError => ({ kind: 'serviceDown', message: 'Le service est momentanément indisponible. Réessayez dans quelques instants.', retryable: true }),
  truncated: (): ChatError => ({ kind: 'truncated', message: 'Réponse interrompue. Réessayez pour obtenir une réponse complète.', retryable: true }),
  quota: (message: string, retryAfterSeconds: number): ChatError => ({ kind: 'quota', message, retryable: false, retryAfterSeconds }),
  fromStream: (err: SSEStreamError): ChatError => {
    if (err.kind === 'http') return classifyHttpError(err.status, err.retryAfterHeader, err.responseBody)
    if (err.kind === 'timeout') return { kind: 'timeout', message: 'Le service met trop de temps à répondre. Réessayez.', retryable: true }
    return { kind: 'network', message: 'Connexion impossible. Vérifiez votre réseau puis réessayez.', retryable: true }
  },
}
