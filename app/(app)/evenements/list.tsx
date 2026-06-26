import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Head from 'expo-router/head'
import { useMedia, XStack, YStack } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'

import { useLayoutSpacing } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import { VoxButton } from '@/components/Button'
import { QueryBoundary } from '@/components/QueryBoundary'
import { MapListToggle } from '@/features_next/events/components/feed-layout/MapListToggle'
import { PinnedItemBanner } from '@/features_next/events/components/feed-layout/PinnedItemBanner'
import EventsListPage from '@/features_next/events/pages/list'

import * as metatags from '@/config/metatags'

const EventsListRoute = () => {
  const media = useMedia()
  const router = useRouter()
  const { itemType } = useLocalSearchParams<{ itemType?: string }>()
  const pinnedBannerOuterSpacing = useLayoutSpacing({ top: true, left: false, right: false, bottom: false })

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.push('/evenements')
    }
  }

  const banner = media.sm ? undefined : (
    <YStack paddingTop={pinnedBannerOuterSpacing.paddingTop} gap="$medium">
      <XStack alignItems="center" justifyContent="space-between" gap="$small">
        <VoxButton variant="soft" size="lg" shrink iconLeft={ArrowLeft} theme="gray" bg="$white1" onPress={handleBack} aria-label="Retour " />
        <MapListToggle activeView="list" mapHref="/evenements/map" listHref="/evenements/list" />
      </XStack>
      <QueryBoundary>
        <PinnedItemBanner />
      </QueryBoundary>
    </YStack>
  )

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Événements - Liste')}</title>
      </Head>
      <Layout.Container banner={banner} safeHorizontalPadding={false} hideTabBar>
        <EventsListPage itemType={itemType} />
      </Layout.Container>
    </>
  )
}

export default EventsListRoute
