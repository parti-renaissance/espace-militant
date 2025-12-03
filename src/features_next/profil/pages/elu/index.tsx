import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useGetElectProfil } from '@/services/profile/hook'
import { useMedia, YStack } from 'tamagui'
import ForceBirthdateModal from '../account/form/ForceBirthdateModal'
import CotisationHistoryEluCard from './components/CotisationHistoryEluCard'
import DeclaEluCard from './components/DeclaEluCard'
import DeclaMandateEluCard from './components/DeclaMandateEluCard'
import InfoEluCard from './components/InfoEluCard'
import ProfilLayout from '@/features_next/profil/components/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'

const EluScreen = () => {
  const { data: profile } = useGetElectProfil()
  const media = useMedia()

  return (
    <ProfilLayout>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <LayoutScrollView padding="left">
          <YStack gap={media.sm ? 8 : '$medium'} flex={1} pt={media.sm ? 8 : undefined}>
            <ForceBirthdateModal />
            <InfoEluCard profil={profile} />
            <DeclaEluCard declaration={profile.last_revenue_declaration?.amount} cotisation={profile.contribution_amount ?? undefined} />
            <DeclaMandateEluCard profil={profile} />
            <CotisationHistoryEluCard payments={profile.payments} />
          </YStack>
        </LayoutScrollView>
      </KeyboardAvoidingView>
    </ProfilLayout>
  )
}

export default EluScreen
