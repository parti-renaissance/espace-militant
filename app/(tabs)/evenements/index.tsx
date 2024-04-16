import React from 'react'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import EventFeedList from '@/screens/events/EventFeedList'
import { Stack as RouterStack } from 'expo-router'
import Head from 'expo-router/head';
import * as metatags from '@/config/metatags'

const EventsScreen: React.FC = () => {
  return (
    <>
      <RouterStack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Head>
        <title>{metatags.createTitle('Nos événements')}</title>
      </Head>

      <PageLayout>
        <PageLayout.SideBarLeft />
        <PageLayout.MainSingleColumn>
          <BoundarySuspenseWrapper loadingMessage="Nous chargeons votre fil">
            <EventFeedList />
          </BoundarySuspenseWrapper>
        </PageLayout.MainSingleColumn>
        <PageLayout.SideBarRight />
      </PageLayout>
    </>
  )
}

export default EventsScreen
