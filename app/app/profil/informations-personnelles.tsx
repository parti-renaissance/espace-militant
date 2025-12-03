import React from 'react'
import ProfilLayout from '@/features/profil/components/ProfilPage'
import Screen from '@/features/profil/pages/account'

export default function InformationsPersonelScreen() {
  return (
    <ProfilLayout screenName="informations-personnelles">
      <Screen />
    </ProfilLayout>
  )
}
