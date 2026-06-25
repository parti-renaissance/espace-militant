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
  won?: boolean
  playersCount?: number
  imageUrl?: string
}

export const PRONO_PAGE_COPY = {
  badge: 'Le défi du Mondial',
  subtitle: 'Avant chaque match des Bleus, Gabriel Attal pose son pronostic. À toi de le battre.',
  cta: 'Je défie Gabriel',
}
