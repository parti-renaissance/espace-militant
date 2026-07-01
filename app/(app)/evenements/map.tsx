import React from 'react'
import Head from 'expo-router/head'

import Layout from '@/components/AppStructure/Layout/Layout'
import EventsMapPage from '@/features/events/pages/map'

import * as metatags from '@/config/metatags'

const EventsMapRoute = () => {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Événements - Carte')}</title>
      </Head>
      <Layout.Container safeHorizontalPadding={false} hideTabBar sidebarState="floating">
        <EventsMapPage />
      </Layout.Container>
    </>
  )
}

export default EventsMapRoute
