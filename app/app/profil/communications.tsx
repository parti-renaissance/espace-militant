import React from 'react'
import ProfilLayout from '@/features/profil/components/ProfilPage'
import Screen from '@/features/profil/pages/communications'

export default function CommunicationScreen() {
  return (
    <ProfilLayout screenName="communications">
      <Screen />
    </ProfilLayout>
  )
}
