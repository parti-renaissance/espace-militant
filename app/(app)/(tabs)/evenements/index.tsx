import React, { Suspense, useMemo } from 'react'
import { Link } from 'expo-router'
import Head from 'expo-router/head'
import { isWeb, useMedia, YStack } from 'tamagui'

import useLayoutSpacing from '@/components/AppStructure/hooks/useLayoutSpacing'
import { Sparkle } from '@tamagui/lucide-icons'

import Layout from '@/components/AppStructure/Layout/Layout'
import { VoxButton } from '@/components/Button'
import EventFeed from '@/features_next/events/pages/feed'
import { PinnedItemBanner } from '@/features_next/events/components/feed-layout/PinnedItemBanner'
import { QueryBoundary } from '@/components/QueryBoundary'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'
import { usePinnedEventsInfiniteQuery } from '@/services/events/hook'
import { useUserScopeFeatures } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

const CreateEventFloatingButton = () => {
  const { isAuth } = useSession()
  const { hasFeature } = useUserScopeFeatures({ enabled: isAuth })
  const canCreate = isAuth && hasFeature(FEATURES.EVENTS)

  const floatingContent = useMemo(() => {
    if (!canCreate) return null
    return (
      <YStack>
        <Link href="/evenements/creer" asChild={!isWeb}>
          <VoxButton size="lg" theme="purple" iconLeft={Sparkle}>
            Organiser un événement
          </VoxButton>
        </Link>
      </YStack>
    )
  }, [canCreate])

  return floatingContent
}

export default function EvenementsPage() {
  const media = useMedia()
  const { data: pinnedFeed } = usePinnedEventsInfiniteQuery()
  const hasPinnedBannerContent = useMemo(() => {
    const items = pinnedFeed?.pages.flatMap((p) => p?.items ?? []) ?? []
    return items.length > 0
  }, [pinnedFeed?.pages])
  const pinnedBannerOuterSpacing = useLayoutSpacing({ top: true, left: false, right: false, bottom: false })
  const banner = media.sm ? undefined : (
    <YStack paddingTop={hasPinnedBannerContent ? pinnedBannerOuterSpacing.paddingTop : 0}>
      <QueryBoundary>
        <PinnedItemBanner />
      </QueryBoundary>
    </YStack>
  )

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Nos événements')}</title>
      </Head>
      <Layout.Container
        banner={banner}
        floatingContent={
          <Suspense fallback={null}>
            <CreateEventFloatingButton />
          </Suspense>
        }
      >
        <EventFeed />
      </Layout.Container>
    </>
  )
}
