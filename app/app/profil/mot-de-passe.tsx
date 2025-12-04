import React from 'react'
import ProfilLayout from '@/features/profil/components/ProfilPage'
import Screen from '@/features/profil/pages/password'

export default function PasswordScreen() {
  return (
    <ProfilLayout screenName="mot-de-passe">
      <Screen />
    </ProfilLayout>
  )
}
