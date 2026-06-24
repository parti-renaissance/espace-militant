import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

import { PronoScore, PronoTeam } from './model'

export const formatTeamLabel = (home: PronoTeam, away: PronoTeam): string => {
  const formatTeam = (team: PronoTeam) => [team.flag, team.code].filter(Boolean).join(' ')
  return `${formatTeam(home)} / ${formatTeam(away)}`
}

export const formatScore = (score: PronoScore): string => `${score.home} - ${score.away}`


export const formatKickoffLabel = (iso: string): string => {
  const label = format(new Date(iso), 'EEEE d MMMM - HH:mm', { locale: fr })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export const parsePlayerPredictionFromUri = (uri?: string | string[]): PronoScore | null => {
  const raw = Array.isArray(uri) ? uri[0] : uri
  if (!raw || !raw.includes('?')) return null
  const query = new URLSearchParams(raw.slice(raw.indexOf('?') + 1))
  const home = Number.parseInt(query.get('home') ?? '', 10)
  const away = Number.parseInt(query.get('away') ?? '', 10)
  if (Number.isNaN(home) || Number.isNaN(away)) return null
  return { home, away }
}
