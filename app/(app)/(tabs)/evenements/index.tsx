import React, { Suspense, useMemo } from 'react'
import { Link } from 'expo-router'
import Head from 'expo-router/head'
import { isWeb, YStack } from 'tamagui'
import { Sparkle } from '@tamagui/lucide-icons'

import Layout from '@/components/AppStructure/Layout/Layout'
import { VoxButton } from '@/components/Button'
import EventFeed from '@/features_next/events/pages/feed'
import { PinnedEventBanner } from '@/features_next/events/pages/feed/components/PinnedEventBanner'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

const CreateEventFloatingButton = () => {
  const { isAuth } = useSession()
  const { hasFeature } = useGetExecutiveScopes()
  const canCreate = isAuth && hasFeature ? hasFeature(FEATURES.EVENTS) : false

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
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Nos événements')}</title>
      </Head>
      <Layout.Container
        banner={
          <Suspense fallback={null}>
            <PinnedEventBanner />
          </Suspense>
        }
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
