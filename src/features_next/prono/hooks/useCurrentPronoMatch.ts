import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { useSession } from '@/ctx/SessionProvider'
import { getAlerts } from '@/services/alerts/api'
import type { RestAlertsResponse } from '@/services/alerts/schema'

import { PRONO_FALLBACK_MATCH, PronoMatchView, PronoStatus } from '../model'
import { formatKickoffLabel } from '../utils'

type UseCurrentPronoMatchResult = {
  match: PronoMatchView
  isLoading: boolean
}

const PronoStatusSchema = z.enum(['scheduled', 'not_participated', 'participated', 'closed', 'result_available'])

const PronoScoreSchema = z.object({
  team_1_score: z.number(),
  team_2_score: z.number(),
})

const PronosticAlertDataSchema = z.object({
  uuid: z.string(),
  title: z.string(),
  match_at: z.string(),
  team_1: z.string(),
  team_2: z.string(),
  gabriel_pronostic: PronoScoreSchema,
  status: PronoStatusSchema,
  participation: PronoScoreSchema.nullish(),
  result: PronoScoreSchema.nullish(),
  won: z.boolean().nullish(),
})

const TEAM_FLAGS: Record<string, string> = {
  BRA: '🇧🇷',
  FRA: '🇫🇷',
}

const toPronoScore = (score: z.infer<typeof PronoScoreSchema>) => ({
  home: score.team_1_score,
  away: score.team_2_score,
})

const findPronosticAlert = (alerts?: RestAlertsResponse) => alerts?.find((alert) => alert.type?.toLowerCase() === 'pronostic')

const mapPronosticAlertToMatch = (alert: RestAlertsResponse[number] | undefined): PronoMatchView | null => {
  if (!alert?.data) return null

  const parsed = PronosticAlertDataSchema.safeParse(alert.data)
  if (!parsed.success) return null

  const data = parsed.data
  const homeCode = data.team_1
  const awayCode = data.team_2

  return {
    uuid: data.uuid,
    label: data.title,
    homeTeam: { code: homeCode, flag: TEAM_FLAGS[homeCode] },
    awayTeam: { code: awayCode, flag: TEAM_FLAGS[awayCode] },
    kickoffLabel: formatKickoffLabel(data.match_at),
    kickoffAt: data.match_at,
    authorPrediction: toPronoScore(data.gabriel_pronostic),
    playerPrediction: data.participation ? toPronoScore(data.participation) : undefined,
    result: data.result ? toPronoScore(data.result) : undefined,
    status: data.status as PronoStatus,
    won: data.won ?? undefined,
    imageUrl: alert.image_url ?? undefined,
  }
}

export function useCurrentPronoMatch(): UseCurrentPronoMatchResult {
  const { isAuth, isLoading: isSessionLoading } = useSession()
  const alertsQuery = useQuery({
    queryKey: ['alerts'],
    queryFn: () => getAlerts(),
    enabled: isAuth,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
  })

  const alertMatch = mapPronosticAlertToMatch(findPronosticAlert(alertsQuery.data))

  return {
    match: alertMatch ?? PRONO_FALLBACK_MATCH,
    isLoading: isSessionLoading || (isAuth && alertsQuery.isLoading),
  }
}
