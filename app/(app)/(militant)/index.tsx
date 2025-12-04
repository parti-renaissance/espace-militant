import React from 'react'
import { Link, Redirect } from 'expo-router'
import Layout from '@/components/AppStructure/Layout/Layout'
import HomeFeed from '@/features/homefeed/HomeFeed'
import { useSession } from '@/ctx/SessionProvider'
import { VoxHeader } from '@/components/Header/Header'
import { XStack } from 'tamagui'
import EuCampaignIllustration from '@/assets/illustrations/EuCampaignIllustration'
import { ProfileNav } from '@/components/Header/Header'

const HomeHeader = () => {
  return (
    <VoxHeader justifyContent="space-between" backgroundColor="$textSurface" borderWidth={0}>
      <XStack flex={1} flexBasis={0}>
        <Link href="/" replace>
          <EuCampaignIllustration cursor="pointer" />
        </Link>
      </XStack>
      <ProfileNav flex={1} flexBasis={0} justifyContent="flex-end" />
    </VoxHeader>
  )
}

export default function AccueilPage() {
  const { isAuth } = useSession()
  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  return (
    <>
      <HomeHeader />
      <Layout.Container>
        <AccueilContent />
      </Layout.Container>
    </>

  )
}

function AccueilContent() {

  return (
    <HomeFeed />
  )
}