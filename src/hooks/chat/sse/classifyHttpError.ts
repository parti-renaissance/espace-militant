import type { ChatError } from '../types'

export function classifyHttpError(status: number, retryAfterHeader: string | null): ChatError {
  const retryAfterRaw = retryAfterHeader ? parseInt(retryAfterHeader, 10) : NaN
  const retryAfterSeconds = Number.isFinite(retryAfterRaw) && retryAfterRaw > 0 ? retryAfterRaw : undefined

  if (status === 401) {
    return { kind: 'auth', message: 'Votre session a expiré. Reconnectez-vous pour continuer.', retryable: false }
  }
  if (status === 403) {
    return { kind: 'forbidden', message: "Vous n'avez pas accès à cette fonctionnalité.", retryable: false }
  }
  if (status === 429) {
    return {
      kind: 'quota',
      message: retryAfterSeconds
        ? `Limite d'utilisation atteinte. Réessayez dans environ ${retryAfterSeconds} secondes.`
        : "Limite d'utilisation atteinte. Réessayez plus tard.",
      retryable: true,
      retryAfterSeconds,
    }
  }
  if (status >= 500) {
    return { kind: 'serviceDown', message: 'Le service est momentanément indisponible. Réessayez dans quelques instants.', retryable: true }
  }
  return { kind: 'unknown', message: 'Une erreur inattendue est survenue. Réessayez.', retryable: true }
}
