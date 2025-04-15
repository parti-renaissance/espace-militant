import React from 'react'
import ProfilLayout from '@/features/profil/components/ProfilPage'
import DashboardScreen from '@/features/profil/pages/dashboard'

function ProfilScreen() {
  return (
    <ProfilLayout screenName="index" backArrow={false}>
      <DashboardScreen />
    </ProfilLayout>
  )
}

export default ProfilScreen
