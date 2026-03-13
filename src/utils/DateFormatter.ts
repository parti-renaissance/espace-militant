import { differenceInDays, format, formatDistanceToNowStrict } from 'date-fns'
import { fr } from 'date-fns/locale'

export const DateFormatter = {
  format: (date: Date, pattern: string): string => {
    return format(date, pattern, { locale: fr })
  },
}

export function relativeDateFormatter(dateString: string | null | undefined): string {
  if (!dateString) {
    return 'Date inconnue'
  }

  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return 'Date invalide'
  }

  const now = new Date()
  const daysDiff = differenceInDays(now, date)

  if (daysDiff < 7) {
    return `il y a ${formatDistanceToNowStrict(date, { addSuffix: false, locale: fr })}`
  } else {
    return `le ${format(date, 'dd/MM/yyyy', { locale: fr })}`
  }
}

/** Date au format court jj/mm/aaaa à partir d'une chaîne ISO. Retourne "—" si vide ou invalide. */
export function formatShortDate(iso?: string | null): string {
  if (!iso) return '—'
  try {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return '—'
    return format(date, 'dd/MM/yyyy', { locale: fr })
  } catch {
    return '—'
  }
}

/** Libellé relatif d'activité (précision à l'heure près). */
export function getRelativeActivityLabel(lastActivityAt?: string | null): string | null {
  if (!lastActivityAt) return null
  try {
    const then = new Date(lastActivityAt).getTime()
    const now = Date.now()
    const diffMs = now - then
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 2) return "Actif à l'instant"
    if (diffMinutes < 60) return `Actif il y a ${diffMinutes} min`
    if (diffHours < 24) return `Actif il y a ${diffHours} h`
    if (diffDays === 1) return 'Actif hier'
    if (diffDays < 7) return `Actif il y a ${diffDays} jours`
    if (diffDays < 30) return `Actif il y a ${Math.floor(diffDays / 7)} sem.`
    if (diffDays < 365) return `Actif il y a ${Math.floor(diffDays / 30)} mois`
    return `Actif il y a ${Math.floor(diffDays / 365)} an(s)`
  } catch {
    return null
  }
}
