import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useGetDetailProfil } from '@/services/profile/hook'
import { useMedia, YStack } from 'tamagui'
import ContactForm from '../account/form/ContactForm'
import ForceBirthdateModal from '../account/form/ForceBirthdateModal'
import NotificationForm from './components/NotificationForm'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import ProfilLayout from '@/features_next/profil/components/Layout'

const CommunicationsContent = () => {
  const { data: profile } = useGetDetailProfil()
  const media = useMedia()

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={100}>
      <LayoutScrollView>
        <YStack gap="$medium" flex={1} pt={media.sm ? '$medium' : undefined}>
          <ForceBirthdateModal />
          <ContactForm profile={profile} />
          <NotificationForm profile={profile} />
        </YStack>
      </LayoutScrollView>
    </KeyboardAvoidingView>
  )
}

const CommunicationsScreen = () => {
  return (
    <ProfilLayout>
      <CommunicationsContent />
    </ProfilLayout>
  )
}

export default CommunicationsScreen
