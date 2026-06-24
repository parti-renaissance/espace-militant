import { useMemo, useState } from 'react'
import { Platform } from 'react-native'
import { router, useLocalSearchParams, useRootNavigationState } from 'expo-router'
import { YStack } from 'tamagui'
import { useToastController } from '@tamagui/toast'

import { AuthRoutes, getAuthHref } from '@/features_next/signup/utils/authNavigation'

import { useSession } from '@/ctx/SessionProvider'

import jouerImage from '../../assets/gabriel-attal-jouer.png'
import pronoFinished from '../../assets/gabriel-attal-onboarding-prono.png'
import PronoCountdown from '../../components/PronoCountdown'
import PronoCtaSection from '../../components/PronoCtaSection'
import PronoHeroSection from '../../components/PronoHeroSection'
import PronoLaunchModal from '../../components/PronoLaunchModal'
import PronoMatchCard from '../../components/PronoMatchCard'
import PronoPronosticsCard, { EditableScore } from '../../components/PronoPronosticsCard'
import PronoScreenShell from '../../components/PronoScreenShell'
import { useCurrentPronoMatch } from '../../hooks/useCurrentPronoMatch'

const MAX_SCORE = 10

const parseScoreParam = (value: string | string[] | undefined): number | undefined => {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === undefined) return undefined
  const parsed = Number.parseInt(raw, 10)
  if (Number.isNaN(parsed)) return undefined
  return Math.max(0, Math.min(MAX_SCORE, parsed))
}

const buildResumeRedirectUri = (prediction: { home: number; away: number }) => `/prono/jouer?home=${prediction.home}&away=${prediction.away}&autoLaunch=1`

export default function PronoGameScreen() {
  const { match } = useCurrentPronoMatch()
  const { isAuth, isLoading } = useSession()
  const isNavigationReady = useRootNavigationState()?.key != null
  const params = useLocalSearchParams<{ home?: string; away?: string; autoLaunch?: string }>()
  const toast = useToastController()

  const resumePrediction = useMemo(() => {
    if (params.autoLaunch !== '1') return null
    const home = parseScoreParam(params.home)
    const away = parseScoreParam(params.away)
    if (home === undefined || away === undefined) return null
    return { home, away }
  }, [params.autoLaunch, params.home, params.away])

  const [playerPrediction, setPlayerPrediction] = useState<EditableScore>(() => resumePrediction ?? {})
  const [hasPlayed, setHasPlayed] = useState(() => resumePrediction != null)
  const [launchModalOpen, setLaunchModalOpen] = useState(() => resumePrediction != null)
  const matchImage = hasPlayed ? pronoFinished : jouerImage
  const matchImageWidth = hasPlayed ? 400 : 300
  const matchImageHeight = hasPlayed ? Math.round(matchImageWidth * (818 / 779)) : 409
  const launchVariant = Platform.OS === 'web' ? 'download' : 'app'

  const handlePlay = () => {
    if (playerPrediction.home === undefined || playerPrediction.away === undefined) {
      toast.show('Pronostic incomplet', { message: 'Renseigne les deux scores.', type: 'error' })
      return
    }

    if (!isAuth) {
      router.push(getAuthHref(AuthRoutes.INSCRIPTION, buildResumeRedirectUri({ home: playerPrediction.home, away: playerPrediction.away })))
      return
    }

    setHasPlayed(true)
    toast.show('Prono enregistré', { message: `Ton score : ${playerPrediction.home} - ${playerPrediction.away}`, type: 'success' })
    setLaunchModalOpen(true)
  }

  if (isLoading || !isNavigationReady) return null

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
        match.kickoffAt ? (
          <PronoCountdown targetAt={match.kickoffAt} />
        ) : null
      ) : (
        <PronoCtaSection label="Je défie Gabriel Attal" onPress={handlePlay} />
      )}
      {playerPrediction.home !== undefined && playerPrediction.away !== undefined ? (
        <PronoLaunchModal
          open={launchModalOpen}
          onClose={() => setLaunchModalOpen(false)}
          variant={launchVariant}
          match={match}
          playerPrediction={{ home: playerPrediction.home, away: playerPrediction.away }}
        />
      ) : null}
    </PronoScreenShell>
  )
}
