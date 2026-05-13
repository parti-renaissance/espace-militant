import React from 'react'
import Head from 'expo-router/head'

import Layout from '@/components/AppStructure/Layout/Layout'
import EventsHubPage from '@/features_next/events/pages/hub'

import * as metatags from '@/config/metatags'

const EventsHubRoute = () => {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Événements')}</title>
      </Head>
      <Layout.Container safeHorizontalPadding={false} sidebarState="floating">
        <EventsHubPage />
      </Layout.Container>
    </>
  )
}

export default EventsHubRoute
