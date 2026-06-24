import { Redirect, useLocalSearchParams, useRootNavigationState } from 'expo-router'

import { useSession } from '@/ctx/SessionProvider'

import PronoResultCard, { PronoResultVariant } from '../../components/PronoResultCard'
import PronoScreenShell from '../../components/PronoScreenShell'
import { useCurrentPronoMatch } from '../../hooks/useCurrentPronoMatch'
import { PronoScore } from '../../model'

type ResultMock = {
  result: PronoScore
  authorPrediction: PronoScore
  playerPrediction: PronoScore
}

const RESULT_MOCKS: Record<PronoResultVariant, ResultMock> = {
  win: { result: { home: 3, away: 1 }, authorPrediction: { home: 2, away: 1 }, playerPrediction: { home: 3, away: 1 } },
  gabriel: { result: { home: 3, away: 0 }, authorPrediction: { home: 2, away: 0 }, playerPrediction: { home: 3, away: 0 } },
}

const parseVariant = (value?: string): PronoResultVariant => (value === 'gabriel' ? value : 'win')

export default function PronoResultScreen() {
  const { match, isLoading: isPronoLoading } = useCurrentPronoMatch()
  const params = useLocalSearchParams<{ variant?: string }>()
  const { isAuth, isLoading } = useSession()
  const isNavigationReady = useRootNavigationState()?.key != null
  const variant = match.won === undefined ? parseVariant(params.variant) : match.won ? 'win' : 'gabriel'
  const mock = RESULT_MOCKS[variant]
  const result = match.result ?? mock.result
  const authorPrediction = match.authorPrediction ?? mock.authorPrediction
  const playerPrediction = match.playerPrediction ?? mock.playerPrediction
  if (isLoading || isPronoLoading || !isNavigationReady) return null

  if (!isAuth) {
    return <Redirect href="/prono" />
  }

  return (
    <PronoScreenShell>
      <PronoResultCard
        variant={variant}
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        result={result}
        authorPrediction={authorPrediction}
        playerPrediction={playerPrediction}
      />
    </PronoScreenShell>
  )
}
