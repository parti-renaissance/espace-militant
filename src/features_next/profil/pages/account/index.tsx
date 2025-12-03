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

const AccountScreen = () => {
  const { data: profile } = useGetDetailProfil()
  const media = useMedia()

  return (
    <ProfilLayout>
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={100}>
      <LayoutScrollView padding="left">
        <YStack gap={media.sm ? 8 : '$medium'} flex={1} pt={media.sm ? 8 : undefined}>
          <ForceBirthdateModal />

          <InformationsForm profile={profile} />
          <ContactForm profile={profile} />
          <LocationForm profile={profile} />
          <RSForm profile={profile} />
        </YStack>
      </LayoutScrollView>
    </KeyboardAvoidingView>
    </ProfilLayout>
  )
}

export default AccountScreen
