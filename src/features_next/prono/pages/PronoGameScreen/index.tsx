import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { Redirect, router, useLocalSearchParams, useRootNavigationState } from 'expo-router'
import { YStack } from 'tamagui'
import { useToastController } from '@tamagui/toast'

import { AuthRoutes, getAuthHref } from '@/features_next/signup/utils/authNavigation'

import { useSession } from '@/ctx/SessionProvider'
import { GenericResponseError } from '@/services/common/errors/generic-errors'
import { useCreatePronosticParticipation } from '@/services/pronostics/hook'

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
  const { match, isLoading: isPronoLoading } = useCurrentPronoMatch()
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
  const hasSubmittedResumePredictionRef = useRef(false)
  const createParticipation = useCreatePronosticParticipation(match.uuid)
  const hasBackendParticipation = Boolean(match.playerPrediction) || match.status === 'participated' || match.status === 'result_available'
  const isPredictionLocked = hasPlayed || hasBackendParticipation
  const displayedPlayerPrediction = match.playerPrediction ?? playerPrediction
  const matchImage = isPredictionLocked ? pronoFinished : jouerImage
  const matchImageWidth = isPredictionLocked ? 400 : 300
  const matchImageHeight = isPredictionLocked ? Math.round(matchImageWidth * (818 / 779)) : 409
  const launchVariant = Platform.OS === 'web' ? 'download' : 'app'

  const submitPrediction = useCallback(
    async (prediction: { home: number; away: number }) => {
      if (!match.uuid) {
        toast.show('Pronostic indisponible', { message: 'Réessaie dans quelques instants.', type: 'error' })
        return false
      }

      try {
        await createParticipation.mutateAsync({
          team_1_score: prediction.home,
          team_2_score: prediction.away,
        })
        setHasPlayed(true)
        toast.show('Prono enregistré', { message: `Ton score : ${prediction.home} - ${prediction.away}`, type: 'success' })
        return true
      } catch (error) {
        setHasPlayed(false)
        const message = error instanceof GenericResponseError ? error.message : "Impossible d'enregistrer ton pronostic."
        toast.show('Erreur', { message, type: 'error' })
        return false
      }
    },
    [createParticipation, match.uuid, toast],
  )

  useEffect(() => {
    if (!resumePrediction || !isAuth || !match.uuid || hasSubmittedResumePredictionRef.current) return

    hasSubmittedResumePredictionRef.current = true
    createParticipation.mutate(
      { team_1_score: resumePrediction.home, team_2_score: resumePrediction.away },
      {
        onError: (error) => {
          const message = error instanceof GenericResponseError ? error.message : "Impossible d'enregistrer ton pronostic."
          toast.show('Erreur', { message, type: 'error' })
        },
      },
    )
  }, [isAuth, resumePrediction, match.uuid, createParticipation, toast])

  const handlePlay = async () => {
    const prediction = {
      home: playerPrediction.home,
      away: playerPrediction.away,
    }

    if (prediction.home === undefined || prediction.away === undefined) {
      toast.show('Pronostic incomplet', { message: 'Renseigne les deux scores.', type: 'error' })
      return
    }

    if (!isAuth) {
      router.push(getAuthHref(AuthRoutes.INSCRIPTION, buildResumeRedirectUri({ home: prediction.home, away: prediction.away })))
      return
    }

    const success = await submitPrediction({ home: prediction.home, away: prediction.away })
    if (success) {
      setLaunchModalOpen(true)
    }
  }

  if (isLoading || isPronoLoading || !isNavigationReady) return null

  if (match.status === 'result_available') {
    return <Redirect href={match.won === false ? '/prono/resultat?variant=gabriel' : '/prono/resultat?variant=win'} />
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
        playerPrediction={displayedPlayerPrediction}
        onPlayerChange={setPlayerPrediction}
        locked={isPredictionLocked}
      />
      {isPredictionLocked ? (
        match.kickoffAt ? (
          <PronoCountdown targetAt={match.kickoffAt} />
        ) : null
      ) : (
        <PronoCtaSection label="Je défie Gabriel Attal" onPress={handlePlay} />
      )}
      {displayedPlayerPrediction.home !== undefined && displayedPlayerPrediction.away !== undefined ? (
        <PronoLaunchModal
          open={launchModalOpen}
          onClose={() => setLaunchModalOpen(false)}
          variant={launchVariant}
          match={match}
          playerPrediction={{ home: displayedPlayerPrediction.home, away: displayedPlayerPrediction.away }}
        />
      ) : null}
    </PronoScreenShell>
  )
}
