import type { ChatError } from '../types'

function extractProblemDetail(body: string | null): string | null {
  if (!body) return null
  try {
    const parsed = JSON.parse(body) as Record<string, unknown>
    if (parsed && typeof parsed.detail === 'string' && parsed.detail.trim()) {
      return parsed.detail.trim()
    }
  } catch {
    return null
  }
  return null
}

export function classifyHttpError(status: number, retryAfterHeader: string | null, responseBody: string | null): ChatError {
  const retryAfterRaw = retryAfterHeader ? parseInt(retryAfterHeader, 10) : NaN
  const retryAfterSeconds = Number.isFinite(retryAfterRaw) && retryAfterRaw > 0 ? retryAfterRaw : undefined

  if (status === 401) {
    return { kind: 'auth', message: 'Votre session a expiré. Reconnectez-vous pour continuer.', retryable: false }
  }
  if (status === 403) {
    return { kind: 'forbidden', message: "Vous n'avez pas accès à cette fonctionnalité.", retryable: false }
  }
  if (status === 429) {
    const detail = extractProblemDetail(responseBody)
    return {
      kind: 'quota',
      message:
        detail ??
        (retryAfterSeconds
          ? `Limite d'utilisation atteinte. Réessayez dans environ ${retryAfterSeconds} secondes.`
          : "Limite d'utilisation atteinte. Réessayez plus tard."),
      retryable: true,
      retryAfterSeconds,
    }
  }
  if (status >= 500) {
    return { kind: 'serviceDown', message: 'Le service est momentanément indisponible. Réessayez dans quelques instants.', retryable: true }
  }
  return { kind: 'unknown', message: 'Une erreur inattendue est survenue. Réessayez.', retryable: true }
}
