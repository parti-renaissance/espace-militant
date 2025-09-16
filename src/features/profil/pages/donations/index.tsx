import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useGetDetailProfil } from '@/services/profile/hook'
import { useMedia, YStack } from 'tamagui'
import ScrollView from '../../components/ScrollView'
import ForceBirthdateModal from '../account/form/ForceBirthdateModal'
import DonationCard from './components/DonationCard'
import DonationHistoryCard from './components/DonationHistoryCard'
import DonationTaxReceiptCard from './components/DonationTaxReceiptsCard'
import MembershipCard from './components/MembershipCard'

const EditInformations = () => {
  const { data: profile } = useGetDetailProfil()
  const media = useMedia()

  return (
    <>
      <ForceBirthdateModal />
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <ScrollView>
          <YStack gap={media.sm ? 8 : '$medium'} flex={1} pt={media.sm ? 8 : undefined}>
            <MembershipCard full other_party_membership={profile.other_party_membership} last_membership_donation={profile.last_membership_donation} />
            <DonationCard full />
            <DonationTaxReceiptCard />
            <DonationHistoryCard />
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default EditInformations
