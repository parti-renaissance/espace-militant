import { useRouter } from 'expo-router'
import { XStack, YStack } from 'tamagui'

import { useDeferredRender } from '@/hooks/useDeferredRender'

import ToiPresidentCard from '@/features/ideas/pages/toi-president/components/ToiPresidentCard'
import { useToiPresidentActions } from '@/features/ideas/pages/toi-president/hooks/useToiPresidentActions'
import { openExternalLink } from '@/utils/linkHandler'

import IdeesBotQuestionCard from './IdeesBotQuestionCard'
import IdeesFormationCard from './IdeesFormationCard'
import IdeesPrioritiesCard from './IdeesPrioritiesCard'
import IdeesShareIdeaCard from './IdeesShareIdeaCard'

const EXTERNAL_LINKS = {
  deposerUneIdee: 'https://parti.re/app-idee/deposer-une-idee',
  campagne: 'https://attalpresident.fr/',
  mesPriorites: 'https://parti.re/app-idee/mes-priorites',
} as const

type IdeesSecondaryCardsProps = {
  userId?: string
  isDesktop: boolean
}

function IdeesDesktopSecondaryCards({ userId }: { userId?: string }) {
  const router = useRouter()
  const toiPresident = useToiPresidentActions()

  return (
    <>
      <XStack gap="$large" alignItems="stretch" flexDirection="row" flexWrap="nowrap">
        <YStack flex={1} flexBasis={0} minWidth={0} gap="$medium">
          <IdeesBotQuestionCard onPress={() => router.push('/idees/bot')} />
          <IdeesPrioritiesCard
            onExplore={() => openExternalLink(EXTERNAL_LINKS.mesPriorites)}
            onCampaignSite={() => openExternalLink(EXTERNAL_LINKS.campagne)}
          />
        </YStack>
        <YStack flex={1} flexBasis={0} minWidth={0}>
          <ToiPresidentCard flex={1} onPlay={toiPresident.play} onShare={toiPresident.share} />
        </YStack>
      </XStack>
      <XStack gap="$large" alignItems="stretch">
        <YStack flex={1} flexBasis={0} minWidth={0}>
          <IdeesShareIdeaCard onPress={() => openExternalLink(EXTERNAL_LINKS.deposerUneIdee, { public_id: userId })} />
        </YStack>
        <YStack flex={1} flexBasis={0} minWidth={0}>
          <IdeesFormationCard />
        </YStack>
      </XStack>
    </>
  )
}

function IdeesMobileSecondaryCards({ userId }: { userId?: string }) {
  const router = useRouter()
  const toiPresident = useToiPresidentActions()

  return (
    <>
      <ToiPresidentCard onPlay={toiPresident.play} onShare={toiPresident.share} />
      <YStack gap="$medium">
        <IdeesBotQuestionCard onPress={() => router.push('/idees/bot')} />
        <IdeesPrioritiesCard
          onExplore={() => openExternalLink(EXTERNAL_LINKS.mesPriorites)}
          onCampaignSite={() => openExternalLink(EXTERNAL_LINKS.campagne)}
        />
        <IdeesShareIdeaCard onPress={() => openExternalLink(EXTERNAL_LINKS.deposerUneIdee, { public_id: userId })} />
        <IdeesFormationCard />
      </YStack>
    </>
  )
}

export default function IdeesSecondaryCards({ userId, isDesktop }: IdeesSecondaryCardsProps) {
  const isReady = useDeferredRender()

  if (!isReady) {
    return null
  }

  return isDesktop ? <IdeesDesktopSecondaryCards userId={userId} /> : <IdeesMobileSecondaryCards userId={userId} />
}
