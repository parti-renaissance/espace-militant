import React from 'react'
import * as metatags from '@/config/metatags'
import EventFeedList from '@/features/events/pages/feed'
import useIsFocused from '@/hooks/useIsFocused'
import Head from 'expo-router/head'

const EventsScreen: React.FC = () => {
  const isFocused = useIsFocused()

  if (!isFocused) {
    return null
  }

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
