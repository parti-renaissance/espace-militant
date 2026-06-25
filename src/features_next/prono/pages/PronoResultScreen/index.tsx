import { Redirect, useRootNavigationState } from 'expo-router'

import { useSession } from '@/ctx/SessionProvider'

import PronoResultCard from '../../components/PronoResultCard'
import PronoScreenShell from '../../components/PronoScreenShell'
import { useCurrentPronoMatch } from '../../hooks/useCurrentPronoMatch'
import { resolveResultVariant } from '../../utils'

export default function PronoResultScreen() {
  const { match, isLoading: isPronoLoading } = useCurrentPronoMatch()
  const { isAuth, isLoading } = useSession()
  const isNavigationReady = useRootNavigationState()?.key != null

  if (isLoading || isPronoLoading || !isNavigationReady) return null

  if (!isAuth || !match || !match.result || !match.authorPrediction || !match.playerPrediction) {
    return <Redirect href="/prono" />
  }

  return (
    <PronoScreenShell>
      <PronoResultCard
        variant={resolveResultVariant(match.resultStatus)}
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        result={match.result}
        authorPrediction={match.authorPrediction}
        playerPrediction={match.playerPrediction}
      />
    </PronoScreenShell>
  )
}
