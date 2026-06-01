import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { isWeb, useMedia, XStack, YStack } from 'tamagui';
import Layout from '@/components/AppStructure/Layout/Layout';
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView';
import Title from '@/components/Title/Title';
import BotQuestionCard from '../components/BotQuestionCard';
import FormationCard from '../components/FormationCard';
import PrioritiesCard from '../components/PrioritiesCard';
import ShareIdeaCard from '../components/ShareIdeaCard';
import ToiPresidentCard from '../components/ToiPresident/ToiPresidentCard';
import { useToiPresidentActions } from '../hooks/useToiPresidentActions';

const EXTERNAL_LINKS = {
  deposerUneIdee: 'https://parti.re/app-idee/deposer-une-idee',
  campagne: 'https://attalpresident.fr/',
  mesPriorites: 'https://attalpresident.fr/mes-priorites',
} as const

const openExternalLink = (url: string) => {
  if (isWeb) {
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    void WebBrowser.openBrowserAsync(url)
  }
}

function HeroTitle({ size = 'h1' }: { size?: 'h1' | 'h2' }) {
  return (
    <Title size={size} aria-label="Ensemble, Débattons de l'avenir">
      <Title.Text>Ensemble,</Title.Text>
      <Title.Break />
      <Title.Highlight>Débattons de l&apos;avenir</Title.Highlight>
    </Title>
  )
}

function DesktopContent() {
  const router = useRouter()
  const toiPresident = useToiPresidentActions()

  return (
    <YStack gap="$large" width="100%">
      <HeroTitle size="h1" />
      <XStack gap="$large" alignItems="stretch" flexDirection="row" flexWrap="nowrap">
        <YStack flex={1} flexBasis={0} minWidth={0} gap="$medium">
          <BotQuestionCard onPress={() => router.push('/idees/bot')} />
          <PrioritiesCard
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
          <ShareIdeaCard onPress={() => openExternalLink(EXTERNAL_LINKS.deposerUneIdee)} />
        </YStack>
        <YStack flex={1} flexBasis={0} minWidth={0}>
          <FormationCard />
        </YStack>
      </XStack>
    </YStack>
  )
}

function MobileContent() {
  const router = useRouter()
  const toiPresident = useToiPresidentActions()

  return (
    <YStack gap="$large">
      <ToiPresidentCard onPlay={toiPresident.play} onShare={toiPresident.share} />
      <HeroTitle size="h2" />
      <YStack gap="$medium">
        <BotQuestionCard onPress={() => router.push('/idees/bot')} />
        <PrioritiesCard onExplore={() => openExternalLink(EXTERNAL_LINKS.mesPriorites)} onCampaignSite={() => openExternalLink(EXTERNAL_LINKS.campagne)} />
        <ShareIdeaCard onPress={() => openExternalLink(EXTERNAL_LINKS.deposerUneIdee)} />
        <FormationCard />
      </YStack>
    </YStack>
  )
}

export default function IdeesScreen() {
  const media = useMedia()

  return (
    <Layout.Container backgroundColor="$gray50" safeHorizontalPadding={false}>
      <Layout.Main maxWidth={892} paddingLeft={media.gtSm ? 24 : 0} paddingRight={media.gtSm ? 24 : 0}>
        <LayoutScrollView padding={media.sm ? { top: false } : true}>
          <YStack p={media.sm ? '$medium' : 0} backgroundColor="$gray50">
            {media.gtSm ? <DesktopContent /> : <MobileContent />}
          </YStack>
        </LayoutScrollView>
      </Layout.Main>
    </Layout.Container>
  )
}
