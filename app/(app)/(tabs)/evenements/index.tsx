import React from 'react'
import * as metatags from '@/config/metatags'
import EventFeedList from '@/features/events/pages/feed'
import Head from 'expo-router/head'

const EventsScreen: React.FC = () => {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Nos événements')}</title>
      </Head>
      <EventFeedList />
    </>
  )
}

export default EventsScreen
