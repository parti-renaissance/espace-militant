import React, { useCallback, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import DeleteAccountModal from '@/components/DeleteAccountModal/DeleteAccountModal'
import ProfilBlock from '@/components/ProfilBlock'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useGetDetailProfil, useGetProfil } from '@/services/profile/hook'
import { HelpingHand } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'
import { isWeb, useMedia, XStack, YStack } from 'tamagui'
import ProfilMenu from '@/features/profil/components/Menu'
import Version from '../../components/Version'
import DonationCard from '../donations/components/DonationCard'
import MembershipCard from '../donations/components/MembershipCard'
import LayoutScrollView from '@/components/Navigation/LayoutScrollView'
import ProfilLayout from '@/features_next/profil/components/Layout'

const DashboardScreen = () => {
  const media = useMedia()
  const { data: profile } = useGetDetailProfil()
  const { data: me } = useGetProfil()
  const insets = useSafeAreaInsets()

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)

  const isAdherent = !!me?.tags?.find((tag) => tag.type === 'adherent')

  const showModal = useCallback(() => {
    setShowDeleteAccountModal(true)
  }, [])

  const hideModal = useCallback(() => {
    setShowDeleteAccountModal(false)
  }, [])

  return (
    <ProfilLayout>
      <LayoutScrollView padding="left">
        <YStack gap="$medium" flex={1} pt={media.sm ? 8 + insets.top : undefined}>
          <ProfilBlock />
          {media.sm && <ProfilMenu />}
          <VoxCard>
            <VoxCard.Content>
              <XStack gap={6} alignItems="center">
                <HelpingHand size={20} />
                <XStack width="100%" flexShrink={1}>
                  <Text.LG multiline semibold>
                    Cotisations et don
                  </Text.LG>
                </XStack>
              </XStack>
              <MembershipCard last_membership_donation={profile.last_membership_donation} other_party_membership={profile.other_party_membership} />
              <DonationCard />
              <XStack alignItems="center" justifyContent="center">
                <Link asChild={!isWeb} href="/profil/cotisations-et-dons" replace={media.gtSm}>
                  <VoxButton variant="outlined">Mon historique de paiement</VoxButton>
                </Link>
              </XStack>
            </VoxCard.Content>
          </VoxCard>

          <YStack justifyContent="center" alignItems="center">
            <SafeAreaView edges={['bottom']}>
              <VoxCard.Content pt={24} gap="$xxxlarge">
                <YStack gap="$medium">
                  <XStack gap={6} alignItems="center">
                    <XStack width="100%" flexShrink={1}>
                      <Text.LG multiline semibold>
                        {isAdherent ? 'Désadhérer et supprimer mon compte' : 'Supprimer mon compte'}
                      </Text.LG>
                    </XStack>
                  </XStack>
                  <Text.P>
                    {isAdherent
                      ? 'Cette action est définitive, vous devrez à nouveau payer une cotisation pour réadhérer. Nous ne serons pas en mesure de restaurer votre historique.'
                      : 'Cette action est définitive et entraintera la suppression de toutes vos informations personnelles. Nous ne serons pas en mesure de restaurer votre historique.'}
                    <Text.BR />
                    <Text.P link color="$orange6" onPress={showModal}>
                      {isAdherent ? 'Je veux désadhérer !' : 'Supprimer mon compte'}
                    </Text.P>
                  </Text.P>
                </YStack>
                <Version />
              </VoxCard.Content>
            </SafeAreaView>
          </YStack>
        </YStack>
      </LayoutScrollView>
      {showDeleteAccountModal && <DeleteAccountModal isOpen={showDeleteAccountModal} onClose={hideModal} isAdherent={isAdherent} />}
    </ProfilLayout>
  )
}

export default DashboardScreen
