import React, { useCallback } from 'react'
import ProfilLayout from '@/features/profil/components/ProfilPage'
import ReferralForm from '@/features/profil/pages/referrals/components/ReferralForm'
import { useRouter } from 'expo-router'
import { View } from 'tamagui'

export default function Invitation() {
  const router = useRouter()

  const onGoBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.push('/profil/parrainages')
    }
  }, [])

  return (
    <ProfilLayout screenName="invitation">
      <View backgroundColor={'$white1'} height={'100%'}>
        <ReferralForm close={onGoBack} />
      </View>
    </ProfilLayout>
  )
}
