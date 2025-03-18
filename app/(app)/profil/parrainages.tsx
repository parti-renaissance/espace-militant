import React from 'react'
import ProfilLayout from '@/features/profil/components/ProfilPage'
import Screen from '@/features/profil/pages/referrals'

export default function ReferralsScreen() {
  return (
    <ProfilLayout screenName="parrainages">
      <Screen />
    </ProfilLayout>
  )
}
