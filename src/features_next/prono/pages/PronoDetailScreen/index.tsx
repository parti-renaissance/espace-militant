import { useState } from 'react'
import { Platform } from 'react-native'
import { YStack } from 'tamagui'
import { useToastController } from '@tamagui/toast'

import Text from '@/components/base/Text'

import { useCreatePronosticParticipation } from '@/services/pronostics/hook'

import jouerImage from '../../assets/gabriel-attal-jouer.png'
import pronoFinished from '../../assets/gabriel-attal-onboarding-prono.png'
import PronoCountdown from '../../components/PronoCountdown'
import PronoCtaSection from '../../components/PronoCtaSection'
import PronoHeroSection from '../../components/PronoHeroSection'
import PronoLaunchModal from '../../components/PronoLaunchModal'
import PronoMatchCard from '../../components/PronoMatchCard'
import PronoPronosticsCard, { EditableScore } from '../../components/PronoPronosticsCard'
import PronoResultCard from '../../components/PronoResultCard'
import PronoScreenShell from '../../components/PronoScreenShell'
import { usePronosticMatch } from '../../hooks/usePronosticMatch'
import { PronoScore } from '../../model'

const EMPTY_SCORE: PronoScore = { home: 0, away: 0 }

type PronoDetailScreenProps = {
  uuid: string
}

export default function PronoDetailScreen({ uuid }: PronoDetailScreenProps) {
  const { match } = usePronosticMatch(uuid)
  const toast = useToastController()
  const createParticipation = useCreatePronosticParticipation(uuid)
  const [draft, setDraft] = useState<EditableScore>({})
  const [launchModalOpen, setLaunchModalOpen] = useState(false)

  const isFormState = match.status === 'not_participated'
  const matchImage = isFormState ? jouerImage : pronoFinished
  const matchImageWidth = isFormState ? 300 : 400
  const matchImageHeight = isFormState ? 409 : Math.round(400 * (818 / 779))
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
      <PronoScreenShell>
        <PronoResultCard
          variant={match.won ? 'win' : 'gabriel'}
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
        playerPrediction={isFormState ? draft : match.playerPrediction}
        onPlayerChange={setDraft}
        locked={!isFormState}
      />
      {match.status === 'scheduled' ? (
        <Text.MD semibold textAlign="center" color="#4555D1">
          Les pronostics ouvrent bientôt.
        </Text.MD>
      ) : null}
      {match.status === 'not_participated' ? <PronoCtaSection label="Je défie Gabriel Attal" onPress={handleParticipate} /> : null}
      {match.status === 'participated' && match.kickoffAt ? <PronoCountdown targetAt={match.kickoffAt} /> : null}
      {match.status === 'closed' ? (
        <Text.MD semibold textAlign="center" color="#4555D1">
          Le match a commencé, le résultat arrive bientôt.
        </Text.MD>
      ) : null}
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
