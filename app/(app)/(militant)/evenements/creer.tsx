import React from 'react'
import Head from 'expo-router/head'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import Layout from '@/components/AppStructure/Layout/Layout'
import * as metatags from '@/config/metatags'
import EventFormScreen, { EventFormScreenSkeleton } from '@/features_next/events/pages/create-edit'

const CreateEventScreen: React.FC = () => {

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
