import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useGetDetailProfil } from '@/services/profile/hook'
import { useMedia, YStack } from 'tamagui'
import ForceBirthdateModal from '../account/form/ForceBirthdateModal'
import DonationCard from './components/DonationCard'
import DonationHistoryCard from './components/DonationHistoryCard'
import DonationTaxReceiptCard from './components/DonationTaxReceiptsCard'
import MembershipCard from './components/MembershipCard'
import ProfilLayout from '@/features_next/profil/components/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'

const DonationsScreen = () => {
  const { data: profile } = useGetDetailProfil()
  const media = useMedia()

  return (
    <ProfilLayout>
      <ForceBirthdateModal />
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <LayoutScrollView padding="left">
          <YStack gap={media.sm ? 8 : '$medium'} flex={1} pt={media.sm ? 8 : undefined}>
            <MembershipCard full other_party_membership={profile.other_party_membership} last_membership_donation={profile.last_membership_donation} />
            <DonationCard full />
            <DonationTaxReceiptCard />
            <DonationHistoryCard />
          </YStack>
        </LayoutScrollView>
      </KeyboardAvoidingView>
    </ProfilLayout>
  )
}

export default DonationsScreen
