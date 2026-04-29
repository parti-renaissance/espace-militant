import React from 'react'
import { useMedia, YStack } from 'tamagui'

import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import ProfilLayout from '@/features_next/profil/components/Layout'

import { useGetDetailProfil } from '@/services/profile/hook'

import ForceBirthdateModal from '../account/form/ForceBirthdateModal'
import DonationCard from './components/DonationCard'
import DonationHistoryCard from './components/DonationHistoryCard'
import DonationTaxReceiptCard from './components/DonationTaxReceiptsCard'
import MembershipCard from './components/MembershipCard'

const DonationsContent = () => {
  const { data: profile } = useGetDetailProfil()
  const media = useMedia()

  return (
    <LayoutScrollView>
      <YStack gap={media.sm ? 8 : '$medium'} flex={1} pt={media.sm ? 8 : undefined}>
        <MembershipCard full other_party_membership={profile.other_party_membership} last_membership_donation={profile.last_membership_donation} />
        <DonationCard full />
        <DonationTaxReceiptCard />
        <DonationHistoryCard />
      </YStack>
    </LayoutScrollView>
  )
}

const DonationsScreen = () => {
  return (
    <ProfilLayout>
      <ForceBirthdateModal />
      <DonationsContent />
    </ProfilLayout>
  )
}

export default DonationsScreen
