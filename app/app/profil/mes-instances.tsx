import React from 'react'
import ProfilLayout from '@/features/profil/components/ProfilPage'
import Screen from '@/features/profil/pages/instances'

export default function InstancesScreen() {
  return (
    <ProfilLayout screenName="mes-instances">
      <Screen />
    </ProfilLayout>
  )
}
