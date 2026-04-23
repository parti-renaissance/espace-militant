import React from 'react'
import { useMedia, YStack } from 'tamagui'

import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import ProfilLayout from '@/features_next/profil/components/Layout'

import { useGetDetailProfil } from '@/services/profile/hook'

import ContactForm from '../account/form/ContactForm'
import ForceBirthdateModal from '../account/form/ForceBirthdateModal'
import NotificationForm from './components/NotificationForm'

const CommunicationsContent = () => {
  const { data: profile } = useGetDetailProfil()
  const media = useMedia()

  return (
    <LayoutScrollView>
      <YStack gap="$medium" flex={1} pt={media.sm ? '$medium' : undefined}>
        <ForceBirthdateModal />
        <ContactForm profile={profile} />
        <NotificationForm profile={profile} />
      </YStack>
    </LayoutScrollView>
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
