import { Redirect, useLocalSearchParams, useRootNavigationState } from 'expo-router'
import { useToastController } from '@tamagui/toast'
import { Send } from '@tamagui/lucide-icons'

import { useSession } from '@/ctx/SessionProvider'
import { AuthRoutes, getAuthHref } from '@/features_next/signup/utils/authNavigation'

import PronoCtaSection from '../../components/PronoCtaSection'
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
  const { match } = useCurrentPronoMatch()
  const params = useLocalSearchParams<{ variant?: string }>()
  const { isAuth, isLoading } = useSession()
  const isNavigationReady = useRootNavigationState()?.key != null
  const toast = useToastController()
  const variant = parseVariant(params.variant)
  const mock = RESULT_MOCKS[variant]
  const redirectUri = params.variant ? `/prono/resultat?variant=${encodeURIComponent(params.variant)}` : '/prono/resultat'

  const handleShare = () => {
    toast.show('Partage', { message: 'Bientôt disponible', type: 'success' })
  }

  if (isLoading || !isNavigationReady) return null

  if (!isAuth) {
    return <Redirect href={getAuthHref(AuthRoutes.INSCRIPTION, redirectUri)} />
  }

  return (
    <PronoScreenShell>
      <PronoResultCard
        variant={variant}
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        result={mock.result}
        authorPrediction={mock.authorPrediction}
        playerPrediction={mock.playerPrediction}
        footer={
          <PronoCtaSection
            label="Je partage mon résultat"
            icon={Send}
            backgroundColor="#F0F1FF"
            textColor="#27221F"
            hoverColor="#E5E8FF"
            pressColor="#E5E8FF"
            onPress={handleShare}
          />
        }
      />
    </PronoScreenShell>
  )
}
