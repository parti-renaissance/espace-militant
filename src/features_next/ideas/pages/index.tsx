import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useMedia, XStack, YStack } from 'tamagui';
import Layout from '@/components/AppStructure/Layout/Layout';
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView';
import Title from '@/components/Title/Title';
import BotQuestionCard from '../components/BotQuestionCard';
import FormationCard from '../components/FormationCard';
import PrioritiesCard from '../components/PrioritiesCard';
import ShareIdeaCard from '../components/ShareIdeaCard';
import ToiPresidentCard from '../components/ToiPresidentCard';

const PAGE_BG = '#faf7f4'

const EXTERNAL_LINKS = {
  deposerUneIdee: 'https://parti.re/app-soutenir/deposer-une-idee',
  formations: 'https://parti.re/app-formations',
  toiPresident: 'https://parti.re/app-toi-president',
  campagne: 'https://parti-renaissance.fr',
} as const

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

  return (
    <YStack gap="$large" width="100%">
      <HeroTitle size="h1" />
      <XStack gap="$large" alignItems="stretch" flexDirection="row" flexWrap="nowrap">
        <YStack flex={1} flexBasis={0} minWidth={0} gap="$medium">
          <BotQuestionCard
          onPress={() => router.push('/idees/bot')}
          onSubmit={(question) => router.push({ pathname: '/idees/bot', params: { question } })}
        />
          <PrioritiesCard
            onExplore={() => router.push('/idees')}
            onCampaignSite={() => Linking.openURL(EXTERNAL_LINKS.campagne)}
          />
        </YStack>
        <YStack flex={1} flexBasis={0} minWidth={0}>
          <ToiPresidentCard
            flex={1}
            onPlay={() => Linking.openURL(EXTERNAL_LINKS.toiPresident)}
            onShare={() => Linking.openURL(EXTERNAL_LINKS.toiPresident)}
          />
        </YStack>
      </XStack>
      <XStack gap="$large" alignItems="stretch">
        <YStack flex={1} flexBasis={0} minWidth={0}>
          <ShareIdeaCard onPress={() => Linking.openURL(EXTERNAL_LINKS.deposerUneIdee)} />
        </YStack>
        <YStack flex={1} flexBasis={0} minWidth={0}>
          <FormationCard onPress={() => Linking.openURL(EXTERNAL_LINKS.formations)} />
        </YStack>
      </XStack>
    </YStack>
  )
}

function MobileContent() {
  const router = useRouter()

  return (
    <YStack gap="$large">
      <ToiPresidentCard
        onPlay={() => Linking.openURL(EXTERNAL_LINKS.toiPresident)}
        onShare={() => Linking.openURL(EXTERNAL_LINKS.toiPresident)}
      />
      <HeroTitle size="h2" />
      <YStack gap="$medium">
        <BotQuestionCard
          onPress={() => router.push('/idees/bot')}
          onSubmit={(question) => router.push({ pathname: '/idees/bot', params: { question } })}
        />
        <PrioritiesCard
          onExplore={() => router.push('/idees')}
          onCampaignSite={() => Linking.openURL(EXTERNAL_LINKS.campagne)}
        />
        <ShareIdeaCard onPress={() => Linking.openURL(EXTERNAL_LINKS.deposerUneIdee)} />
        <FormationCard onPress={() => Linking.openURL(EXTERNAL_LINKS.formations)} />
      </YStack>
    </YStack>
  )
}

export default function IdeesScreen() {
  const media = useMedia()

  return (
    <Layout.Container backgroundColor={PAGE_BG} safeHorizontalPadding={false}>
      <Layout.Main maxWidth={892} paddingLeft={media.gtSm ? 24 : 0} paddingRight={media.gtSm ? 24 : 0}>
        <LayoutScrollView padding={media.sm ? { top: false } : true}>
          <YStack p={media.sm ? '$medium' : 0} backgroundColor={PAGE_BG}>
            {media.gtSm ? <DesktopContent /> : <MobileContent />}
          </YStack>
        </LayoutScrollView>
      </Layout.Main>
    </Layout.Container>
  )
}
