import { useState } from 'react'
import { Redirect, useRootNavigationState } from 'expo-router'
import { useToastController } from '@tamagui/toast'

import { useSession } from '@/ctx/SessionProvider'
import { AuthRoutes, getAuthHref } from '@/features_next/signup/utils/authNavigation'

import jouerImage from '../../assets/gabriel-attal-jouer.png'
import PronoCountdown from '../../components/PronoCountdown'
import PronoCtaSection from '../../components/PronoCtaSection'
import PronoHeroSection from '../../components/PronoHeroSection'
import PronoMatchCard from '../../components/PronoMatchCard'
import PronoPronosticsCard, { EditableScore } from '../../components/PronoPronosticsCard'
import PronoScreenShell from '../../components/PronoScreenShell'
import { useCurrentPronoMatch } from '../../hooks/useCurrentPronoMatch'
import { PRONO_PAGE_COPY } from '../../model'

export default function PronoGameScreen() {
  const { match } = useCurrentPronoMatch()
  const { isAuth, isLoading } = useSession()
  const isNavigationReady = useRootNavigationState()?.key != null
  const toast = useToastController()
  const [playerPrediction, setPlayerPrediction] = useState<EditableScore>({})
  const [hasPlayed, setHasPlayed] = useState(false)

  const handlePlay = () => {
    if (playerPrediction.home === undefined || playerPrediction.away === undefined) {
      toast.show('Pronostic incomplet', { message: 'Renseigne les deux scores.', type: 'error' })
      return
    }
    setHasPlayed(true)
    toast.show('Prono enregistré', { message: `Ton score : ${playerPrediction.home} - ${playerPrediction.away}`, type: 'success' })
  }

  if (isLoading || !isNavigationReady) return null

  if (!isAuth) {
    return <Redirect href={getAuthHref(AuthRoutes.INSCRIPTION, '/prono/jouer')} />
  }

  return (
    <PronoScreenShell>
      <PronoHeroSection showSubtitle={false} showBadge={false} />
      <PronoMatchCard match={match} showAuthorPrediction={false} showBadge image={jouerImage} imageWidth={300} imageHeight={409} />
      <PronoPronosticsCard
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        authorPrediction={match.authorPrediction}
        playerPrediction={playerPrediction}
        onPlayerChange={setPlayerPrediction}
        locked={hasPlayed}
      />
      {hasPlayed ? (
        match.kickoffAt ? <PronoCountdown targetAt={match.kickoffAt} /> : null
      ) : (
        <PronoCtaSection label={PRONO_PAGE_COPY.cta} onPress={handlePlay} />
      )}
    </PronoScreenShell>
  )
}
