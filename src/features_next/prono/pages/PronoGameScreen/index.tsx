import { useState } from 'react'
import { Redirect, useRootNavigationState } from 'expo-router'
import { YStack } from 'tamagui'
import { useToastController } from '@tamagui/toast'

import { useSession } from '@/ctx/SessionProvider'
import { AuthRoutes, getAuthHref } from '@/features_next/signup/utils/authNavigation'

import jouerImage from '../../assets/gabriel-attal-jouer.png'
import pronoFinished from '../../assets/gabriel-attal-onboarding-prono.png'
import PronoCountdown from '../../components/PronoCountdown'
import PronoCtaSection from '../../components/PronoCtaSection'
import PronoHeroSection from '../../components/PronoHeroSection'
import PronoMatchCard from '../../components/PronoMatchCard'
import PronoPronosticsCard, { EditableScore } from '../../components/PronoPronosticsCard'
import PronoScreenShell from '../../components/PronoScreenShell'
import { useCurrentPronoMatch } from '../../hooks/useCurrentPronoMatch'

export default function PronoGameScreen() {
  const { match } = useCurrentPronoMatch()
  const { isAuth, isLoading } = useSession()
  const isNavigationReady = useRootNavigationState()?.key != null
  const toast = useToastController()
  const [playerPrediction, setPlayerPrediction] = useState<EditableScore>({})
  const [hasPlayed, setHasPlayed] = useState(false)
  const matchImage = hasPlayed ? pronoFinished : jouerImage
  const matchImageWidth = hasPlayed ? 400 : 300
  const matchImageHeight = hasPlayed ? Math.round(matchImageWidth * (818 / 779)) : 409

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
      <YStack marginTop="$medium">
        <PronoHeroSection showSubtitle={false} showBadge={false} />
      </YStack>
      <PronoMatchCard
        match={match}
        showAuthorPrediction={false}
        image={matchImage}
        imageWidth={matchImageWidth}
        imageHeight={matchImageHeight}
        cropAfterKickoff
        panelPaddingBottom={7}
        contentOffsetY={16}
      />
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
        <PronoCtaSection label="Je défie Gabriel Attal" onPress={handlePlay} />
      )}
    </PronoScreenShell>
  )
}
