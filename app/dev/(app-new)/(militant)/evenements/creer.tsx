import React from 'react'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import Layout from '@/components/Navigation/Layout'
import * as metatags from '@/config/metatags'
import EventFormScreen, { EventFormScreenSkeleton } from '@/features_next/events/pages/create-edit'
import Head from 'expo-router/head'
import { useHideTabBar } from '@/components/Navigation/LayoutContext'

const CreateEventScreen: React.FC = () => {
  useHideTabBar()

  return (
    <Layout.Container>
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
