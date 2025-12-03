import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useGetDetailProfil } from '@/services/profile/hook'
import { useMedia, YStack } from 'tamagui'
import ContactForm from '../account/form/ContactForm'
import ForceBirthdateModal from '../account/form/ForceBirthdateModal'
import NotificationForm from './components/NotificationForm'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import ProfilLayout from '@/features_next/profil/components/Layout'

const CommunicationsScreen = () => {
  const { data: profile } = useGetDetailProfil()
  const media = useMedia()

  return (
    <ProfilLayout>
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={100}>
      <LayoutScrollView padding="left">
        <YStack gap="$medium" flex={1} pt={media.sm ? '$medium' : undefined}>
          <ForceBirthdateModal />

          <ContactForm profile={profile} />
          <NotificationForm profile={profile} />
        </YStack>
      </LayoutScrollView>
    </KeyboardAvoidingView>
    </ProfilLayout>
  )
}

export default CommunicationsScreen
