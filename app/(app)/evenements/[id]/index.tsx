import React from 'react'
import Error404 from '@/components/404/Error404'
import BoundarySuspenseWrapper, { DefaultErrorFallback } from '@/components/BoundarySuspenseWrapper'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import * as metatags from '@/config/metatags'
import { UnauthorizedError } from '@/core/errors'
import EventDetailsScreen, { EventDetailsScreenDeny, EventDetailsScreenSkeleton } from '@/features/events/pages/detail/EventDetailsScreen'
import { useGetEvent } from '@/services/events/hook'
import { Stack as RouterStack, useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'

const HomeScreen: React.FC = () => {
  const params = useLocalSearchParams<{ id: string }>()
  if (!params.id) return <Error404 />
  return (
    <PageLayout webScrollable>
      <PageLayout.SideBarLeft showOn="gtLg" maxWidth={177}></PageLayout.SideBarLeft>
      <BoundarySuspenseWrapper
        fallback={<EventDetailsScreenSkeleton />}
        errorChildren={(payload) => {
          if (payload.error instanceof UnauthorizedError) {
            return <EventDetailsScreenDeny />
          } else {
            return (
              <PageLayout.StateFrame>
                <DefaultErrorFallback {...payload} />
              </PageLayout.StateFrame>
            )
          }
        }}
      >
        <EventDetailScreen id={params.id} />
      </BoundarySuspenseWrapper>
      <PageLayout.SideBarRight maxWidth={177} />
    </PageLayout>
  )
}

function EventDetailScreen(props: Readonly<{ id: string }>) {
  const { data } = useGetEvent({ id: props.id })
  return (
    <>
      <RouterStack.Screen
        options={{
          title: data.name,
        }}
      />
      <Head>
        <title>{metatags.createTitle(data.name)}</title>
      </Head>
      <EventDetailsScreen data={data} />
    </>
  )
}

export default HomeScreen
