import React from 'react'
import { useMedia, YStack } from 'tamagui'

import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import ProfilLayout from '@/features_next/profil/components/Layout'

import { useGetElectProfil } from '@/services/profile/hook'

import ForceBirthdateModal from '../account/form/ForceBirthdateModal'
import CotisationHistoryEluCard from './components/CotisationHistoryEluCard'
import DeclaEluCard from './components/DeclaEluCard'
import DeclaMandateEluCard from './components/DeclaMandateEluCard'
import InfoEluCard from './components/InfoEluCard'

const EluScreen = () => {
  return (
    <ProfilLayout>
      <EluContent />
    </ProfilLayout>
  )
}

const EluContent = () => {
  const { data: profile } = useGetElectProfil()
  const media = useMedia()

  return (
    <LayoutScrollView>
      <YStack gap={media.sm ? 8 : '$medium'} flex={1} pt={media.sm ? 8 : undefined}>
        <ForceBirthdateModal />
        <InfoEluCard profil={profile} />
        <DeclaEluCard declaration={profile.last_revenue_declaration?.amount} cotisation={profile.contribution_amount ?? undefined} />
        <DeclaMandateEluCard profil={profile} />
        <CotisationHistoryEluCard payments={profile.payments} />
      </YStack>
    </LayoutScrollView>
  )
}

export default EluScreen
