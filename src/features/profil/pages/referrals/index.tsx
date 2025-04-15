import React from 'react'
import ScrollView from '@/features/profil/components/ScrollView'
import ReferralCodeCard from '@/features/profil/pages/referrals/components/ReferralCodeCard'
import ReferralListCard from '@/features/profil/pages/referrals/components/ReferralListCard'
import ReferralLockedCard from '@/features/profil/pages/referrals/components/ReferralLockedCard'
import { useIsAdherent } from '@/services/profile/hook'
import { useMedia, YStack } from 'tamagui'

export default function ReferralsPage() {
  const isAdherent = useIsAdherent()
  const { xs } = useMedia()

  return (
    <ScrollView>
      {isAdherent ? (
        <YStack gap={'$medium'}>
          <ReferralCodeCard />
          <ReferralListCard />
        </YStack>
      ) : (
        <ReferralLockedCard hideHeader={xs} />
      )}
    </ScrollView>
  )
}
