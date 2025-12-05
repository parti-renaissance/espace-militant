import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useGetDetailProfil } from '@/services/profile/hook'
import { useMedia, YStack } from 'tamagui'
import ContactForm from './form/ContactForm'
import ForceBirthdateModal from './form/ForceBirthdateModal'
import InformationsForm from './form/InformationForm'
import LocationForm from './form/LocationForm'
import RSForm from './form/RSForm'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import ProfilLayout from '@/features_next/profil/components/Layout'

const AccountContent = () => {
  const { data: profile } = useGetDetailProfil()
  const media = useMedia()

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <LayoutScrollView>
          <YStack gap={media.sm ? 8 : '$medium'} flex={1} pt={media.sm ? 8 : undefined}>
            <ForceBirthdateModal />

            <InformationsForm profile={profile} />
            <ContactForm profile={profile} />
            <LocationForm profile={profile} />
            <RSForm profile={profile} />
          </YStack>
        </LayoutScrollView>
      </KeyboardAvoidingView>
  )
}

const AccountScreen = () => {

  return (
    <ProfilLayout>
      <AccountContent />
    </ProfilLayout>
  )
}

export default AccountScreen
