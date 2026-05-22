import React from 'react'
import { Redirect } from 'expo-router'
import Head from 'expo-router/head'

import { AccessDeny } from '@/components/AccessDeny'
import Layout from '@/components/AppStructure/Layout/Layout'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import EventFormScreen, { EventFormScreenSkeleton } from '@/features_next/events/pages/create-edit'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'
import { useUserScopeFeatures } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

const CreateEventScreen: React.FC = () => {
  const { isAuth } = useSession()
  const { hasFeature, isLoading } = useUserScopeFeatures({ enabled: isAuth })
  const canCreate = hasFeature(FEATURES.EVENTS)

  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  if (!canCreate && !isLoading) {
    return (
      <Layout.Container hideSideBar hideTabBar>
        <AccessDeny />
      </Layout.Container>
    )
  }

  return (
    <Layout.Container hideSideBar hideTabBar>
      <BoundarySuspenseWrapper fallback={<EventFormScreenSkeleton />}>
        <_EventFormScreen />
      </BoundarySuspenseWrapper>
    </Layout.Container>
  )
}

function _EventFormScreen() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Nouvel événement')}</title>
      </Head>
      <EventFormScreen />
    </>
  )
}

export default CreateEventScreen
