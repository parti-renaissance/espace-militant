import React from 'react'
import { Stack as RouterStack, useLocalSearchParams, useGlobalSearchParams } from 'expo-router'
import Head from 'expo-router/head'
import Error404 from '@/components/404/Error404'
import BoundarySuspenseWrapper, { DefaultErrorFallback } from '@/components/BoundarySuspenseWrapper'
import Layout from '@/components/AppStructure/Layout/Layout'
import * as metatags from '@/config/metatags'
import clientEnv from '@/config/clientEnv'
import { ForbiddenError, UnauthorizedError } from '@/core/errors'
import EventDetailsScreen, { EventDetailsScreenDeny, EventDetailsScreenSkeleton } from '@/features_next/events/pages/detail'
import { useGetEvent } from '@/services/events/hook'
import { useHits } from '@/services/hits/hook'
import { cleanupUrlParams } from '@/utils/urlCleanup'
import { resolveSource } from '@/utils/sourceResolver'

const BASE_URL = `https://${clientEnv.ASSOCIATED_DOMAIN}`

const EventDetailScreen: React.FC = () => {
  
  const params = useLocalSearchParams<{ id: string }>()
  if (!params.id) return <Error404 />
  return (
    <Layout.Container>
        <BoundarySuspenseWrapper
          fallback={<EventDetailsScreenSkeleton />}
          errorChildren={(payload) => {
            if (payload.error instanceof UnauthorizedError || payload.error instanceof ForbiddenError) {
              return <EventDetailsScreenDeny error={payload.error} />
            } else {
              return <DefaultErrorFallback {...payload} />
            }
          }}
        >
          <_EventDetailScreen id={params.id} />
        </BoundarySuspenseWrapper>
    </Layout.Container>
  )
}

function _EventDetailScreen(props: Readonly<{ id: string }>) {
  const { data, isLoading: isEventLoading, error: eventError } = useGetEvent({ id: props.id })
  const { trackOpen } = useHits()
  const searchParams = useGlobalSearchParams<{
    utm_source?: string
    utm_campaign?: string
    ref?: string
    source?: string
  }>()
  const sentRef = React.useRef<string | null>(null)
  const ogUrl = `${BASE_URL}/evenements/${props.id}`

  React.useEffect(() => {
    if (!isEventLoading && !eventError && data) {
      if (sentRef.current !== props.id) {
        sentRef.current = props.id

        trackOpen({
          object_type: 'event',
          object_id: props.id,
          source: resolveSource(searchParams.source),
          utm_source: searchParams.utm_source,
          utm_campaign: searchParams.utm_campaign,
          referrer_code: searchParams.ref
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
        <title>{metatags.createTitle(data?.name || "Détails de l'événement")}</title>
        <meta key="og-title" property="og:title" content={metatags.createTitle('Rejoignez nos événements')} />
        <meta key="og-description" property="og:description" content="Découvrez l'actualité militante et inscrivez-vous aux événements près de chez vous." />
        <meta key="og-image" property="og:image" content={`${BASE_URL}/og-evenement.png`} />
        <meta key="og-url" property="og:url" content={ogUrl} />
        <meta key="og-type" property="og:type" content="event" />
      </Head>
      <EventDetailsScreen data={data} />
    </>
  )
}

export default EventDetailScreen
