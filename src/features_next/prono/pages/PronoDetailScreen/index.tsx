import { useState } from 'react';
import { Platform } from 'react-native';
import { YStack } from 'tamagui';
import { useToastController } from '@tamagui/toast';



import { useCreatePronosticParticipation } from '@/services/pronostics/hook';



import gabrielBall from '../../assets/gabriel-attal-ball.png';
import PronoCountdown from '../../components/PronoCountdown';
import PronoCtaSection from '../../components/PronoCtaSection';
import PronoHeroSection from '../../components/PronoHeroSection';
import PronoLaunchModal from '../../components/PronoLaunchModal';
import PronoMatchCard from '../../components/PronoMatchCard';
import PronoNotice from '../../components/PronoNotice';
import PronoPronosticsCard, { EditableScore } from '../../components/PronoPronosticsCard';
import PronoResultCard from '../../components/PronoResultCard';
import PronoScreenShell from '../../components/PronoScreenShell';
import { usePronosticMatch } from '../../hooks/usePronosticMatch';
import { PRONO_PAGE_COPY, PronoScore } from '../../model';
import { getPronoCtaState, hasPronoMatchStarted, resolveResultVariant } from '../../utils';


const EMPTY_SCORE: PronoScore = { home: 0, away: 0 }

type PronoDetailScreenProps = {
  uuid: string
}

export default function PronoDetailScreen({ uuid }: PronoDetailScreenProps) {
  const { match, isRefetching, refetch } = usePronosticMatch(uuid)
  const toast = useToastController()
  const createParticipation = useCreatePronosticParticipation(uuid)
  const [draft, setDraft] = useState<EditableScore>({})
  const [launchModalOpen, setLaunchModalOpen] = useState(false)

  const hasBackendParticipation = Boolean(match.playerPrediction) || match.status === 'participated' || match.status === 'result_available'
  const hasMatchStarted = hasPronoMatchStarted(match)
  const isFormState = match.status === 'not_participated' && !hasMatchStarted
  const ctaState = getPronoCtaState(match, hasBackendParticipation)
  const matchImage = gabrielBall
  const matchImageWidth = isFormState ? 300 : 300
  const matchImageHeight = Math.round(matchImageWidth * (810 / 600))
  const launchVariant = Platform.OS === 'web' ? 'download' : 'app'
  const modalPrediction = match.playerPrediction ?? (draft.home !== undefined && draft.away !== undefined ? { home: draft.home, away: draft.away } : undefined)

  const handleParticipate = () => {
    if (draft.home === undefined || draft.away === undefined) {
      toast.show('Pronostic incomplet', { message: 'Renseigne les deux scores.', type: 'error' })
      return
    }

    createParticipation.mutate({ team_1_score: draft.home, team_2_score: draft.away }, { onSuccess: () => setLaunchModalOpen(true) })
  }

  if (match.status === 'result_available') {
    return (
      <PronoScreenShell onRefresh={refetch} refreshing={isRefetching}>
        <PronoResultCard
          variant={resolveResultVariant(match.resultStatus)}
          homeTeam={match.homeTeam}
          awayTeam={match.awayTeam}
          result={match.result ?? EMPTY_SCORE}
          authorPrediction={match.authorPrediction ?? EMPTY_SCORE}
          playerPrediction={match.playerPrediction ?? EMPTY_SCORE}
        />
      </PronoScreenShell>
    )
  }

  return (
    <PronoScreenShell onRefresh={refetch} refreshing={isRefetching}>
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
        playerPrediction={isFormState ? draft : match.playerPrediction}
        onPlayerChange={setDraft}
        locked={!isFormState}
      />
      {ctaState === 'predictions_soon' ? (
        <PronoNotice>{PRONO_PAGE_COPY.predictionsSoon}</PronoNotice>
      ) : ctaState === 'can_play' ? (
        <PronoCtaSection label={PRONO_PAGE_COPY.cta} onPress={handleParticipate} />
      ) : ctaState === 'awaiting_kickoff' ? (
        match.kickoffAt ? <PronoCountdown targetAt={match.kickoffAt} /> : null
      ) : (
        <PronoNotice>{PRONO_PAGE_COPY.matchStarted}</PronoNotice>
      )}
      {modalPrediction ? (
        <PronoLaunchModal
          open={launchModalOpen}
          onClose={() => setLaunchModalOpen(false)}
          variant={launchVariant}
          match={match}
          playerPrediction={modalPrediction}
        />
      ) : null}
    </PronoScreenShell>
  )
}
