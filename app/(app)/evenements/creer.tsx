import React from 'react'
import Head from 'expo-router/head'
import { Redirect } from 'expo-router'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import Layout from '@/components/AppStructure/Layout/Layout'
import * as metatags from '@/config/metatags'
import EventFormScreen, { EventFormScreenSkeleton } from '@/features_next/events/pages/create-edit'
import { useSession } from '@/ctx/SessionProvider'

const CreateEventScreen: React.FC = () => {
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href={'/evenements'} />
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
