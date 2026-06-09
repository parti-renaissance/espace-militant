import { Suspense, useCallback, useState } from 'react'
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
import { useRequireAuth } from '@/components/RequireAuth'
import Title from '@/components/Title/Title'
import { HubOrganizeCategoryModal } from '@/features_next/events/pages/hub/components/HubOrganizeCategoryModal'
import { useOpenOrganiserEvenement } from '@/features_next/profil/hooks/useOpenOrganiserEvenement'
import { DoubleSquare } from '@/features_next/profil/pages/instances/components/icons'

import { useShareOrCopy } from '@/hooks/useShareOrCopy'
import { useGetProfil } from '@/services/profile/hook'
import { openExternalLink } from '@/utils/linkHandler'

import HERO_IMAGE_URI from '../assets/soutenir-gabriel-attal.jpg'

const EXTERNAL_LINKS = {
  deposerUneIdee: 'https://parti.re/app-soutenir/deposer-une-idee',
  rejoindreEquipe: 'https://parti.re/app-soutenir/rejoindre-lequipe',
  contactNational: 'https://parti.re/app-soutenir/contact-national',
} as const

const SOCIAL_LINKS = {
  whatsapp: 'https://whatsapp.com/channel/0029VaEHqOx3rZZizaSlrH1R',
  telegram: 'https://t.me/gabriel_attal',
  instagram: 'https://www.instagram.com/gabrielattal/',
  tiktok: 'https://www.tiktok.com/@gabriel_attal',
  x: 'https://x.com/GabrielAttal',
  facebook: 'https://www.facebook.com/GabrielAttal/',
  linkedin: 'https://fr.linkedin.com/in/gabrielattal',
} as const

const INVITE_SHARE_MESSAGE = "Téléchargez l'application de campagne pour nous rejoindre !"
const DEFAULT_APP_INVITE_URL = 'https://attal.app/stores'

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
        cachePolicy="memory-disk"
        style={{ width: '100%', aspectRatio: isDesktop ? 424 / 363 : 390 / 264 }}
      />
    </YStack>
  )
}

function ContactNationalButton() {
  const { data: user } = useGetProfil()

  return (
    <VoxButton variant="outlined" iconLeft={Phone} onPress={() => openExternalLink(EXTERNAL_LINKS.contactNational, { public_id: user?.id })}>
      Être contacté par les équipes
    </VoxButton>
  )
}

function CallToActionCards() {
  const router = useRouter()
  const { data: user } = useGetProfil()
  const { handleShareOrCopy } = useShareOrCopy()
  const { openOrganiserModal } = useOpenOrganiserEvenement()
  const { isAuth, redirectToSignup } = useRequireAuth()
  const [organizeModalOpen, setOrganizeModalOpen] = useState(false)

  const handleDeposerUneIdee = useCallback(() => {
    if (!isAuth) {
      redirectToSignup()
      return
    }
    void openExternalLink(EXTERNAL_LINKS.deposerUneIdee, { public_id: user?.id })
  }, [isAuth, redirectToSignup, user?.id])

  const handleInviteFriend = useCallback(() => {
    return handleShareOrCopy({
      url: DEFAULT_APP_INVITE_URL,
      message: INVITE_SHARE_MESSAGE,
    })
  }, [handleShareOrCopy])

  const handleOpenOrganizeModal = useCallback(() => {
    openOrganiserModal(() => setOrganizeModalOpen(true))
  }, [openOrganiserModal])

  const handleCloseOrganizeModal = useCallback(() => {
    setOrganizeModalOpen(false)
  }, [])

  const handleRejoindreAgora = useCallback(() => {
    if (!isAuth) {
      redirectToSignup()
      return
    }
    router.push('/profil/mes-instances')
  }, [isAuth, redirectToSignup, router])

  const organizeModal = organizeModalOpen ? (
    <Suspense fallback={null}>
      <HubOrganizeCategoryModal open onClose={handleCloseOrganizeModal} />
    </Suspense>
  ) : null

  return (
    <>
      <YStack gap="$medium">
        <CallToActionCard icon={Lightbulb} title="Je partage une idée" description="Votre voix compte : soumettez vos propositions." theme="green">
          <VoxButton theme="green" variant="soft" onPress={handleDeposerUneIdee}>
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
            <VoxButton theme="pink" variant="outlined" iconLeft={Plus} onPress={handleOpenOrganizeModal}>
              J&apos;organise un événement
            </VoxButton>
          </XStack>
        </CallToActionCard>

        <CallToActionCard icon={Users} title="Je rejoins l'équipe" description="Devenez ambassadeur de la campagne." theme="teal">
          <VoxButton theme="teal" variant="soft" onPress={() => openExternalLink(EXTERNAL_LINKS.rejoindreEquipe, { public_id: user?.id })}>
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
          icon={DoubleSquare}
          title="Je rejoins une Agora thématique"
          description="Fabriquez nos idées de demain en rejoignant un groupe de travail et d'exploration sur une thématique."
        >
          <VoxButton variant="soft" onPress={handleRejoindreAgora}>
            Rejoindre une Agora
          </VoxButton>
        </CallToActionCard>

        <CallToActionCard
          icon={UserPlus}
          title="J'invite un ami sur la campagne"
          description="Invitez une personne de votre entourage à télécharger l'application de campagne."
          theme="orange"
        >
          <VoxButton theme="orange" variant="soft" onPress={handleInviteFriend}>
            Envoyer une invitation
          </VoxButton>
        </CallToActionCard>
      </YStack>
      {organizeModal}
    </>
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
