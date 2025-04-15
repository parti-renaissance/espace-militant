import React from 'react'
import ProfilLayout from '@/features/profil/components/ProfilPage'
import DashboardScreen from '@/features/profil/pages/dashboard'
import useIsFocused from '@/hooks/useIsFocused'

function ProfilScreen() {
  const isFocused = useIsFocused()

  if (!isFocused) {
    return null
  }

  return (
    <ProfilLayout screenName="index" backArrow={false}>
      <DashboardScreen />
    </ProfilLayout>
  )
}

export default ProfilScreen
