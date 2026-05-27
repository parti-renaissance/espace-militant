import { Linking } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useMedia, XStack, YStack } from 'tamagui'
import {
  CalendarDays,
  Facebook,
  Instagram,
  Lightbulb,
  Linkedin,
  MessageCircle,
  Music2,
  Phone,
  Plus,
  Send,
  Twitter,
  UserPlus,
  Users,
} from '@tamagui/lucide-icons'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import CallToActionCard from '@/components/CallToActionCard/CallToActionCard'
import Title from '@/components/Title/Title'

import HERO_IMAGE_URI from '../assets/soutenir-gabriel-attal.png'

const EXTERNAL_LINKS = {
  deposerUneIdee: 'https://parti.re/app-soutenir/deposer-une-idee',
  rejoindreEquipe: 'https://parti.re/app-soutenir/rejoindre-lequipe',
  contactNational: 'https://parti.re/app-soutenir/contact-national',
} as const

const SOCIAL_LINKS = {
  whatsapp: 'https://wa.me',
  telegram: 'https://t.me',
  instagram: 'https://www.instagram.com',
  tiktok: 'https://www.tiktok.com',
  x: 'https://x.com',
  facebook: 'https://www.facebook.com',
  linkedin: 'https://www.linkedin.com',
} as const

function HeroTitleSection() {
  return (
    <YStack gap="$medium">
      <Title size="h1" aria-label="Vous aussi, vous pouvez faire la différence">
        <Title.Text>VOUS AUSSI, VOUS POUVEZ</Title.Text>
        <Title.Break />
        <Title.Highlight>FAIRE LA DIFFÉRENCE</Title.Highlight>
      </Title>
      <Text.LG regular>
        <Text.LG semibold>Soutenir Gabriel Attal</Text.LG>, c‘est simple :
      </Text.LG>
    </YStack>
  )
}

function HeroImageSection({ isDesktop }: { isDesktop: boolean }) {
  const media = useMedia()

  return (
    <YStack borderRadius={media.sm ? 0 : '$medium'} overflow="hidden">
      <Image
        source={HERO_IMAGE_URI}
        contentFit="cover"
        contentPosition={isDesktop ? 'center' : 'top'}
        style={{ width: '100%', height: isDesktop ? 504 : 360 }}
      />
    </YStack>
  )
}

function ContactNationalButton() {
  return (
    <VoxButton variant="outlined" iconLeft={Phone} onPress={() => Linking.openURL(EXTERNAL_LINKS.contactNational)}>
      Être contacté par les équipes nationales
    </VoxButton>
  )
}

function CallToActionCards() {
  const router = useRouter()

  return (
    <YStack gap="$medium">
      <CallToActionCard icon={Lightbulb} title="Je partage une idée" description="Votre voix compte : soumettez vos propositions." theme="green">
        <VoxButton theme="green" variant="soft" onPress={() => Linking.openURL(EXTERNAL_LINKS.deposerUneIdee)}>
          Déposer une idée
        </VoxButton>
      </CallToActionCard>

      <CallToActionCard
        icon={CalendarDays}
        title="Je participe à un événement"
        description="Meeting, action de terrain, collage ou réunion publique."
        theme="blue"
      >
        <XStack flexWrap="wrap" gap={12}>
          <VoxButton theme="blue" variant="soft" onPress={() => router.push('/evenements')}>
            Voir les événements
          </VoxButton>
          <VoxButton theme="pink" variant="outlined" iconLeft={Plus} onPress={() => router.push('/evenements/creer')}>
            J&apos;organise un événement
          </VoxButton>
        </XStack>
      </CallToActionCard>

      <CallToActionCard icon={Users} title="Je rejoins l'équipe" description="Devenez ambassadeur de la campagne." theme="teal">
        <VoxButton theme="teal" variant="soft" onPress={() => Linking.openURL(EXTERNAL_LINKS.rejoindreEquipe)}>
          Postuler
        </VoxButton>
      </CallToActionCard>

      <CallToActionCard icon={Send} title="Je suis l'actualité de Gabriel Attal" description="Suivez-nous sur nos réseaux et partagez nos publications.">
        <XStack flexWrap="wrap" gap={12}>
          <VoxButton variant="soft" iconLeft={MessageCircle} onPress={() => Linking.openURL(SOCIAL_LINKS.whatsapp)}>
            Whatsapp
          </VoxButton>
          <VoxButton variant="soft" iconLeft={Send} onPress={() => Linking.openURL(SOCIAL_LINKS.telegram)}>
            Telegram
          </VoxButton>
        </XStack>
        <XStack flexWrap="wrap" gap={12}>
          <VoxButton variant="soft" iconLeft={Instagram} shrink onPress={() => Linking.openURL(SOCIAL_LINKS.instagram)} />
          <VoxButton variant="soft" iconLeft={Music2} shrink onPress={() => Linking.openURL(SOCIAL_LINKS.tiktok)} />
          <VoxButton variant="soft" iconLeft={Twitter} shrink onPress={() => Linking.openURL(SOCIAL_LINKS.x)} />
          <VoxButton variant="soft" iconLeft={Facebook} shrink onPress={() => Linking.openURL(SOCIAL_LINKS.facebook)} />
          <VoxButton variant="soft" iconLeft={Linkedin} shrink onPress={() => Linking.openURL(SOCIAL_LINKS.linkedin)} />
        </XStack>
      </CallToActionCard>

      <CallToActionCard
        icon={Send}
        title="Je rejoins une Agora thématique"
        description="Fabriquez nos idées de demain en rejoignant un groupe de travail et d'exploration sur une thématique."
      >
        <VoxButton variant="soft" onPress={() => router.push('/profil/mes-instances')}>
          Rejoindre une Agora
        </VoxButton>
      </CallToActionCard>

      <CallToActionCard
        icon={UserPlus}
        title="J'invite un ami sur la campagne"
        description="Invitez une personne de votre entourage à télécharger l'application de campagne."
        theme="orange"
      >
        <VoxButton theme="orange" variant="soft" onPress={() => router.push('/parrainages')}>
          Envoyer une invitation
        </VoxButton>
      </CallToActionCard>
    </YStack>
  )
}

function DesktopContent() {
  return (
    <XStack flexDirection="row" gap="$large">
      <YStack flex={1} maxWidth={424} gap="$large" flexShrink={0}>
        <HeroTitleSection />
        <HeroImageSection isDesktop />
        <ContactNationalButton />
      </YStack>

      <YStack flex={1} maxWidth={424}>
        <CallToActionCards />
      </YStack>
    </XStack>
  )
}

function MobileContent() {
  const media = useMedia()

  return (
    <YStack gap="$large">
      <HeroImageSection isDesktop={false} />
      <YStack gap="$large" px={media.sm ? '$medium' : 0}>
        <HeroTitleSection />
        <CallToActionCards />
        <ContactNationalButton />
      </YStack>
    </YStack>
  )
}

export default function SoutenirScreen() {
  const media = useMedia()

  return (
    <Layout.Container>
      <Layout.Main maxWidth={892}>
        <LayoutScrollView padding={media.sm ? { top: false } : true}>
          <YStack backgroundColor="$gray50" p={media.sm ? 0 : '$medium'}>
            {media.gtMd ? <DesktopContent /> : <MobileContent />}
          </YStack>
        </LayoutScrollView>
      </Layout.Main>
    </Layout.Container>
  )
}
