import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useGetDetailProfil } from '@/services/profile/hook'
import { YStack } from 'tamagui'
import ScrollView from '../../components/ScrollView'
import ContactForm from '../account/form/ContactForm'
import ForceBirthdateModal from '../account/form/ForceBirthdateModal'
import NotificationForm from './components/NotificationForm'

const EditInformations = () => {
  const { data: profile } = useGetDetailProfil()

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={100}>
      <ScrollView>
        <YStack gap="$medium" flex={1} $sm={{ pt: '$medium' }}>
          <ForceBirthdateModal />

          <ContactForm profile={profile} />
          <NotificationForm profile={profile} />
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default EditInformations
