import { Suspense, useCallback, useState } from 'react'
import { Linking } from 'react-native'
import { useRouter } from 'expo-router'
import { XStack, YStack } from 'tamagui'
import { CalendarDays, Facebook, Instagram, Lightbulb, Linkedin, MessageCircle, Music2, Plus, Send, Twitter, UserPlus, Users } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import CallToActionCard from '@/components/CallToActionCard/CallToActionCard'
import { useRequireAuth } from '@/components/RequireAuth'
import { HubOrganizeCategoryModal } from '@/features_next/events/pages/hub/components/HubOrganizeCategoryModal'
import { useOpenOrganiserEvenement } from '@/features_next/profil/hooks/useOpenOrganiserEvenement'
import { useProfileCompletionAccess } from '@/features_next/profil/hooks/useProfileCompletionAccess'
import { DoubleSquare } from '@/features_next/profil/pages/instances/components/icons'

import clientEnv from '@/config/clientEnv'
import { useDeferredRender } from '@/hooks/useDeferredRender'
import { useShareOrCopy } from '@/hooks/useShareOrCopy'
import { openExternalLink } from '@/utils/linkHandler'

const EXTERNAL_LINKS = {
  deposerUneIdee: 'https://parti.re/app-soutenir/deposer-une-idee',
  rejoindreEquipe: 'https://parti.re/app-soutenir/rejoindre-lequipe',
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

const getAppInviteUrl = (publicId?: string | null) => `https://${clientEnv.ASSOCIATED_DOMAIN}/bienvenue?ref=${publicId ?? 'share'}`

function useSoutenirCallToActionCards(userId?: string) {
  const router = useRouter()
  const { handleShareOrCopy } = useShareOrCopy()
  const { openOrganiserModal } = useOpenOrganiserEvenement()
  const { isAuth, redirectToSignup } = useRequireAuth()
  const { runWithCompleteProfile } = useProfileCompletionAccess()
  const [organizeModalOpen, setOrganizeModalOpen] = useState(false)
  const showSecondaryCards = useDeferredRender()

  const handleDeposerUneIdee = useCallback(() => {
    if (!isAuth) {
      redirectToSignup()
      return
    }
    void openExternalLink(EXTERNAL_LINKS.deposerUneIdee, { public_id: userId })
  }, [isAuth, redirectToSignup, userId])

  const handleInviteFriend = useCallback(() => {
    return handleShareOrCopy({
      url: getAppInviteUrl(userId),
      message: INVITE_SHARE_MESSAGE,
    })
  }, [handleShareOrCopy, userId])

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

  const handleVoirEvenements = useCallback(() => {
    router.push('/evenements')
  }, [router])

  const handleRejoindreEquipe = useCallback(() => {
    runWithCompleteProfile(() => {
      void openExternalLink(EXTERNAL_LINKS.rejoindreEquipe, { public_id: userId })
    })
  }, [runWithCompleteProfile, userId])

  return {
    showSecondaryCards,
    organizeModalOpen,
    handleDeposerUneIdee,
    handleInviteFriend,
    handleOpenOrganizeModal,
    handleCloseOrganizeModal,
    handleRejoindreAgora,
    handleVoirEvenements,
    handleRejoindreEquipe,
  }
}

type SoutenirCallToActionCardsProps = {
  userId?: string
}

export default function SoutenirCallToActionCards({ userId }: SoutenirCallToActionCardsProps) {
  const {
    showSecondaryCards,
    organizeModalOpen,
    handleDeposerUneIdee,
    handleInviteFriend,
    handleOpenOrganizeModal,
    handleCloseOrganizeModal,
    handleRejoindreAgora,
    handleVoirEvenements,
    handleRejoindreEquipe,
  } = useSoutenirCallToActionCards(userId)

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
            <VoxButton theme="blue" variant="soft" onPress={handleVoirEvenements}>
              Voir les événements
            </VoxButton>
            <VoxButton theme="pink" variant="outlined" iconLeft={Plus} onPress={handleOpenOrganizeModal}>
              J&apos;organise un événement
            </VoxButton>
          </XStack>
        </CallToActionCard>

        <CallToActionCard icon={Users} title="Je rejoins l'équipe" description="Devenez ambassadeur de la campagne." theme="teal">
          <VoxButton theme="teal" variant="soft" onPress={handleRejoindreEquipe}>
            Postuler
          </VoxButton>
        </CallToActionCard>

        {showSecondaryCards ? (
          <>
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
          </>
        ) : null}
      </YStack>
      {organizeModal}
    </>
  )
}
