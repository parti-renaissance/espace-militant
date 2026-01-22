import React from 'react'
import Error404 from '@/components/404/Error404'
import Layout from '@/components/AppStructure/Layout/Layout'
import BoundarySuspenseWrapper, { DefaultErrorFallback } from '@/components/BoundarySuspenseWrapper'
import * as metatags from '@/config/metatags'
import { ForbiddenError, UnauthorizedError } from '@/core/errors'
import MessageDetailsScreen, { MessageDetailsScreenDeny, MessageDetailsScreenSkeleton } from '@/features_next/publications/pages/detail'
import { useHits } from '@/services/hits/hook'
import { useGetMessage, useGetMessageFilters } from '@/services/publications/hook'
import { usePublicationStats } from '@/services/stats/hook'
import { useUserStore } from '@/store/user-store'
import { resolveSource } from '@/utils/sourceResolver'
import { cleanupUrlParams } from '@/utils/urlCleanup'
import { Stack as RouterStack, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'
import { Header } from '@/components/AppStructure'

const MessageDetailsPage: React.FC = () => {
  const params = useLocalSearchParams<{ id: string }>()

  if (!params.id) return <Error404 />

  return (
    <>
      <Header title="Publications" />
      <Layout.Container hideTabBar>
        <BoundarySuspenseWrapper
          fallback={<MessageDetailsScreenSkeleton />}
          errorChildren={(payload) => {
            if (payload.error instanceof UnauthorizedError || payload.error instanceof ForbiddenError) {
              return <MessageDetailsScreenDeny error={payload.error} />
            } else {
              return <DefaultErrorFallback {...payload} />
            }
          }}
        >
          <MessageDetailScreen id={params.id} />
        </BoundarySuspenseWrapper>
      </Layout.Container>
    </>
  )
}

function MessageDetailScreen(props: Readonly<{ id: string }>) {
  const { defaultScope } = useUserStore()
  const {
    data: messageData,
    isLoading: isMessageLoading,
    error: messageError,
  } = useGetMessage({
    messageId: props.id,
    scope: defaultScope!,
    enabled: true,
  })
  const { trackOpen } = useHits()
  const searchParams = useGlobalSearchParams<{
    utm_source?: string
    utm_campaign?: string
    ref?: string
    source?: string
  }>()
  const sentRef = React.useRef<string | null>(null)
  const {
    data: publicationStats,
    refetch: refetchStats,
    isRefetching: isRefetchingStats,
  } = usePublicationStats({
    uuid: props.id,
    enabled: messageData?.editable === true,
  })

  const { data: messageFilters } = useGetMessageFilters({
    messageId: props.id,
    scope: defaultScope!,
    enabled: messageData?.editable === true,
  })

  React.useEffect(() => {
    if (!isMessageLoading && !messageError && messageData) {
      if (sentRef.current !== props.id) {
        sentRef.current = props.id

        try {
          trackOpen({
            object_type: 'publication',
            object_id: props.id,
            source: resolveSource(searchParams.source),
            utm_source: searchParams.utm_source,
            utm_campaign: searchParams.utm_campaign,
            referrer_code: searchParams.ref
          })
        } catch (error) {
          // Silently ignore tracking errors - they should not impact user experience
          if (__DEV__) {
            console.warn('[PublicationPage] trackOpen error:', error)
          }
        }

        cleanupUrlParams(['source'])
      }
    }
  }, [props.id, isMessageLoading, messageError, messageData, trackOpen, searchParams])

  if (isMessageLoading) {
    return <MessageDetailsScreenSkeleton />
  }

  if (!messageData) {
    return <Error404 />
  }

  return (
    <>
      <RouterStack.Screen
        options={{
          title: messageData.subject || 'Détails du message',
        }}
      />
      <Head>
        <title>{metatags.createTitle(messageData.subject || 'Détails du message')}</title>
      </Head>
      <MessageDetailsScreen
        data={messageData}
        stats={publicationStats}
        filters={messageFilters}
        onRefreshStats={() => {
          refetchStats()
        }}
        isRefreshingStats={isRefetchingStats}
      />
    </>
  )
}

export default MessageDetailsPage
