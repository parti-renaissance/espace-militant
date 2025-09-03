import React from 'react'
import Error404 from '@/components/404/Error404'
import BoundarySuspenseWrapper, { DefaultErrorFallback } from '@/components/BoundarySuspenseWrapper'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import * as metatags from '@/config/metatags'
import { ForbiddenError, UnauthorizedError } from '@/core/errors'
import EventDetailsScreen, { EventDetailsScreenDeny, EventDetailsScreenSkeleton } from '@/features/events/pages/detail/EventDetailsScreen'
import { useGetEvent } from '@/services/events/hook'
import { Stack as RouterStack, useLocalSearchParams, useGlobalSearchParams } from 'expo-router'
import Head from 'expo-router/head'
import { useHits } from '@/services/hits/hook'
import { cleanupUrlParams } from '@/utils/urlCleanup'
import { resolveSource } from '@/utils/sourceResolver'

const HomeScreen: React.FC = () => {
  const params = useLocalSearchParams<{ id: string }>()
  if (!params.id) return <Error404 />
  return (
    <PageLayout webScrollable>
      <PageLayout.SideBarLeft showOn="gtLg" maxWidth={177}></PageLayout.SideBarLeft>
      <BoundarySuspenseWrapper
        fallback={<EventDetailsScreenSkeleton />}
        errorChildren={(payload) => {
          if (payload.error instanceof UnauthorizedError || payload.error instanceof ForbiddenError) {
            return <EventDetailsScreenDeny error={payload.error} />
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
  const { data, isLoading: isEventLoading, error: eventError } = useGetEvent({ id: props.id })
  const { trackOpen } = useHits()
  const searchParams = useGlobalSearchParams<{
    utm_source?: string
    utm_campaign?: string
    referrer_code?: string
    source?: string
  }>()
  const sentRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!isEventLoading && !eventError && data) {
      if (sentRef.current !== props.id) {
        sentRef.current = props.id
        
        trackOpen({ 
          object_type: 'evenement', 
          object_id: props.id, 
          source: resolveSource(searchParams.source),
          utm_source: searchParams.utm_source,
          utm_campaign: searchParams.utm_campaign,
          referrer_code: searchParams.referrer_code
        })
        
        cleanupUrlParams(['source'])
      }
    }
  }, [props.id, isEventLoading, eventError, data, trackOpen, searchParams])

  return (
    <>
      <RouterStack.Screen
        options={{
          title: data?.name || 'Détails de l\'événement',
        }}
      />
      <Head>
        <title>{metatags.createTitle(data?.name || 'Détails de l\'événement')}</title>
      </Head>
      <EventDetailsScreen data={data} />
    </>
  )
}

export default HomeScreen
