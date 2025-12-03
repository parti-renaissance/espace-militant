import React from 'react'
import ProfilLayout from '@/features/profil/components/ProfilPage'
import Screen from '@/features/profil/pages/donations'

export default function DonationScreen() {
  return (
    <ProfilLayout screenName="cotisations-et-dons">
      <Screen />
    </ProfilLayout>
  )
}
