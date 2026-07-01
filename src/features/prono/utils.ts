import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

import type { PronosticResultStatus, RestPronosticData, RestPronosticScore } from '@/services/pronostics/schema'

import { PronoMatchView, PronoScore, PronoTeam } from './model'

const toPronoScore = (score: RestPronosticScore): PronoScore => ({
  home: score.team_1_score,
  away: score.team_2_score,
})

export const mapPronosticDataToMatch = (data: RestPronosticData, imageUrl?: string): PronoMatchView => ({
  uuid: data.uuid,
  label: data.title,
  homeTeam: { code: data.team_1 },
  awayTeam: { code: data.team_2 },
  kickoffLabel: formatKickoffLabel(data.match_at),
  kickoffAt: data.match_at,
  beginAt: data.begin_at ?? undefined,
  authorPrediction: toPronoScore(data.gabriel_pronostic),
  playerPrediction: data.participation ? toPronoScore(data.participation) : undefined,
  result: data.result ? toPronoScore(data.result) : undefined,
  status: data.status,
  resultStatus: data.result_status ?? undefined,
  won: data.won ?? undefined,
  imageUrl,
})

export const resolveResultVariant = (resultStatus?: PronosticResultStatus): 'win' | 'gabriel' | 'draw' => {
  if (resultStatus === 'won') return 'win'
  if (resultStatus === 'draw') return 'draw'
  return 'gabriel'
}

export const formatTeamLabel = (home: PronoTeam, away: PronoTeam): string => {
  const formatTeam = (team: PronoTeam) => [team.flag, team.code].filter(Boolean).join(' ')
  return `${formatTeam(home)} / ${formatTeam(away)}`
}

export const formatScore = (score: PronoScore): string => `${score.home} - ${score.away}`

export const formatKickoffLabel = (iso: string): string => {
  const label = format(new Date(iso), 'EEEE d MMMM - HH:mm', { locale: fr })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export const hasPronoMatchStarted = (match: Pick<PronoMatchView, 'status' | 'kickoffAt'>): boolean => {
  if (match.status === 'closed') return true
  if (!match.kickoffAt) return false

  const kickoffAt = new Date(match.kickoffAt)
  return !Number.isNaN(kickoffAt.getTime()) && Date.now() >= kickoffAt.getTime()
}

export type PronoCtaState = 'can_play' | 'predictions_soon' | 'awaiting_kickoff' | 'awaiting_result'

export const getPronoCtaState = (match: Pick<PronoMatchView, 'status' | 'kickoffAt'>, hasParticipation: boolean): PronoCtaState => {
  if (match.status === 'closed') return 'awaiting_result'
  if (hasParticipation) return 'awaiting_kickoff'
  if (hasPronoMatchStarted(match)) return 'awaiting_result'
  if (match.status === 'scheduled') return 'predictions_soon'
  return 'can_play'
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
