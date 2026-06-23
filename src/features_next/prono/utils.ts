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
