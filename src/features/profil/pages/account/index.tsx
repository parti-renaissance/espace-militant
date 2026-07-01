import React from 'react'
import { useMedia, YStack } from 'tamagui'

import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import ProfilLayout from '@/features/profil/components/Layout'
import RequireCompleteProfileGate from '@/features/profil/components/RequireCompleteProfileGate'

import { useGetDetailProfil } from '@/services/profile/hook'

import ContactForm from './form/ContactForm'
import ForceBirthdateModal from './form/ForceBirthdateModal'
import InformationsForm from './form/InformationForm'
import LocationForm from './form/LocationForm'
import RSForm from './form/RSForm'

const AccountContent = () => {
  const { data: profile } = useGetDetailProfil()
  const media = useMedia()

  return (
    <LayoutScrollView>
      <YStack gap={media.sm ? 8 : '$medium'} flex={1} pt={media.sm ? 8 : undefined}>
        <ForceBirthdateModal />

        <InformationsForm profile={profile} />
        <ContactForm profile={profile} />
        <LocationForm profile={profile} />
        <RSForm profile={profile} />
      </YStack>
    </LayoutScrollView>
  )
}

const AccountScreen = () => (
  <ProfilLayout>
    <RequireCompleteProfileGate redirectTo="/profil/informations-personnelles">
      <AccountContent />
    </RequireCompleteProfileGate>
  </ProfilLayout>
)

export default AccountScreen
