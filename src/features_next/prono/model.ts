export type PronoTeam = {
  code: string
  name?: string
  flag?: string
}

export type PronoScore = {
  home: number
  away: number
}

export type PronoStatus = 'scheduled' | 'not_participated' | 'participated' | 'closed' | 'result_available'

export type PronoMatchView = {
  uuid?: string
  label: string
  homeTeam: PronoTeam
  awayTeam: PronoTeam
  kickoffLabel: string
  kickoffAt?: string
  beginAt?: string
  authorPrediction?: PronoScore
  playerPrediction?: PronoScore
  result?: PronoScore
  status?: PronoStatus
  resultStatus?: 'won' | 'lost' | 'draw' | 'pending'
  won?: boolean
  playersCount?: number
  imageUrl?: string
}

export const PRONO_PAGE_COPY = {
  badge: 'Le défi du Mondial',
  subtitle: 'Avant chaque match des Bleus, Gabriel Attal annonce son pronostic. Défie-le avec le tien.',
  cta: 'Je défie Gabriel',
}

export const PRONO_MATCH_IMAGE = {
  width: 300,
  height: Math.round(300 * (864 / 614)),
}
