import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { isWeb, useMedia, XStack, YStack } from 'tamagui';

import Layout from '@/components/AppStructure/Layout/Layout';
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView';
import Title from '@/components/Title/Title';
import { useGetProfil } from '@/services/profile/hook';

import BotQuestionCard from '../components/BotQuestionCard';
import FormationCard from '../components/FormationCard';
import PrioritiesCard from '../components/PrioritiesCard';
import ShareIdeaCard from '../components/ShareIdeaCard';
import ToiPresidentCard from '../toiPresident/components/ToiPresidentCard';
import { useToiPresidentActions } from '../toiPresident/hooks/useToiPresidentActions';

const EXTERNAL_LINKS = {
  deposerUneIdee: 'https://parti.re/app-idee/deposer-une-idee',
  campagne: 'https://attalpresident.fr/',
  mesPriorites: 'https://parti.re/app-idee/mes-priorites',
} as const

const appendPublicIdParam = (url: string, publicId?: string | null): string => {
  if (!publicId) return url
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('public_id', publicId)
    return parsed.toString()
  } catch {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}public_id=${encodeURIComponent(publicId)}`
  }
}

const openExternalLink = (url: string, publicId?: string | null) => {
  const finalUrl = appendPublicIdParam(url, publicId)
  if (isWeb) {
    window.open(finalUrl, '_blank', 'noopener,noreferrer')
  } else {
    void WebBrowser.openBrowserAsync(finalUrl)
  }
}

function HeroTitle() {
  return (
    <Title size="h1" aria-label="Ensemble, Débattons de l'avenir">
      <Title.Text>Ensemble,</Title.Text>
      <Title.Break />
      <Title.Highlight>Débattons de l&apos;avenir</Title.Highlight>
    </Title>
  )
}

function DesktopContent() {
  const router = useRouter()
  const { data: user } = useGetProfil()
  const toiPresident = useToiPresidentActions()

  return (
    <YStack gap="$large" width="100%">
      <HeroTitle />
      <XStack gap="$large" alignItems="stretch" flexDirection="row" flexWrap="nowrap">
        <YStack flex={1} flexBasis={0} minWidth={0} gap="$medium">
          <BotQuestionCard onPress={() => router.push('/idees/bot')} />
          <PrioritiesCard onExplore={() => openExternalLink(EXTERNAL_LINKS.mesPriorites)} onCampaignSite={() => openExternalLink(EXTERNAL_LINKS.campagne)} />
        </YStack>
        <YStack flex={1} flexBasis={0} minWidth={0}>
          <ToiPresidentCard flex={1} onPlay={toiPresident.play} onShare={toiPresident.share} />
        </YStack>
      </XStack>
      <XStack gap="$large" alignItems="stretch">
        <YStack flex={1} flexBasis={0} minWidth={0}>
          <ShareIdeaCard onPress={() => openExternalLink(EXTERNAL_LINKS.deposerUneIdee, user?.id)} />
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
  const { data: user } = useGetProfil()
  const toiPresident = useToiPresidentActions()

  return (
    <YStack gap="$large">
      <ToiPresidentCard onPlay={toiPresident.play} onShare={toiPresident.share} />
      <HeroTitle/>
      <YStack gap="$medium">
        <BotQuestionCard onPress={() => router.push('/idees/bot')} />
        <PrioritiesCard onExplore={() => openExternalLink(EXTERNAL_LINKS.mesPriorites)} onCampaignSite={() => openExternalLink(EXTERNAL_LINKS.campagne)} />
        <ShareIdeaCard onPress={() => openExternalLink(EXTERNAL_LINKS.deposerUneIdee, user?.id)} />
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
