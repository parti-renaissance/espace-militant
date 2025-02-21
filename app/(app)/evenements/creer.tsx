import React from 'react'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import * as metatags from '@/config/metatags'
import EventFormScreen, { EventFormScreenSkeleton } from '@/features/events/pages/create-edit'
import Head from 'expo-router/head'

const HomeScreen: React.FC = () => {
  return (
    <PageLayout webScrollable>
      <PageLayout.SideBarLeft showOn="gtLg" maxWidth={100}></PageLayout.SideBarLeft>
      <BoundarySuspenseWrapper fallback={<EventFormScreenSkeleton />}>
        <_EventFormScreen />
      </BoundarySuspenseWrapper>
      <PageLayout.SideBarRight maxWidth={100} />
    </PageLayout>
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

export default HomeScreen
