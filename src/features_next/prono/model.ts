export type PronoTeam = {
  code: string
  name?: string
  flag?: string
}

export type PronoScore = {
  home: number
  away: number
}

export type PronoMatchView = {
  uuid?: string
  label: string
  homeTeam: PronoTeam
  awayTeam: PronoTeam
  kickoffLabel: string
  kickoffAt?: string
  authorPrediction?: PronoScore
  playersCount?: number
  imageUrl?: string
}

export const PRONO_FALLBACK_MATCH: PronoMatchView = {
  label: 'Prochain match',
  homeTeam: { code: 'FRA', name: 'France', flag: '🇫🇷' },
  awayTeam: { code: 'BRA', name: 'Brésil', flag: '🇧🇷' },
  kickoffLabel: 'Mercredi 25 juin - 21:00',
  kickoffAt: '2026-06-25T21:00:00',
  authorPrediction: { home: 2, away: 1 },
  playersCount: 10000,
}

export const PRONO_PAGE_COPY = {
  badge: 'Le défi du Mondial',
  subtitle: 'Avant chaque match des Bleus, Gabriel Attal pose son pronostic. À toi de le battre.',
  cta: 'Je défie Gabriel',
}
