import React from 'react'
import * as metatags from '@/config/metatags'
import clientEnv from '@/config/clientEnv'
import EventFeedList from '@/features/events/pages/feed'
import Head from 'expo-router/head'

const EventsScreen: React.FC = () => {
  const baseUrl = `https://${clientEnv.ASSOCIATED_DOMAIN}`

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Nos événements')}</title>
        <meta key="og-title" property="og:title" content={metatags.createTitle('Nos événements')} />
        <meta key="og-description" property="og:description" content="Découvrez les prochaines actions et événements du parti." />
        <meta key="og-image" property="og:image" content={`${baseUrl}/og-evenements.png`} />
        <meta key="og-url" property="og:url" content={`${baseUrl}/evenements`} />
        <meta key="og-type" property="og:type" content="website" />
      </Head>
      <EventFeedList />
    </>
  )
}

export default EventsScreen
