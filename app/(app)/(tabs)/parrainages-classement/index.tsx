import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import Screen from '@/features/profil/pages/referrals-scoreboard'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'

export default function ReferralsScreen() {
  const insets = useSafeAreaInsets()

  return (
    <PageLayout webScrollable>
      <PageLayout.MainSingleColumn
        width="100%"
        maxWidth="580px"
        mx="auto"
      >
        <BoundarySuspenseWrapper>
          <Screen />
        </BoundarySuspenseWrapper>
      </PageLayout.MainSingleColumn>
    </PageLayout>
  )
}

