import React from 'react'
import { Link, Redirect } from 'expo-router'
import Head from 'expo-router/head'
import { useMedia, XStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import { ProfileNav, VoxHeader } from '@/components/Header/Header'
import TimelineFeedScreen from '@/features_next/timelinefeed/TimelineFeedScreen'

import EuCampaignIllustration from '@/assets/illustrations/EuCampaignIllustration'
import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'

const HomeHeader = () => {
  const media = useMedia()

  if (media.gtSm) {
    return null
  }

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
      <Head>
        <title>{metatags.createTitle('Plateforme')}</title>
      </Head>
      <HomeHeader />
      <Layout.Container>
        <TimelineFeedScreen />
      </Layout.Container>
    </>
  )
}
