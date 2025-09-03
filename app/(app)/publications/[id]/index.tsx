import React from 'react'
import Error404 from '@/components/404/Error404'
import BoundarySuspenseWrapper, { DefaultErrorFallback } from '@/components/BoundarySuspenseWrapper'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import * as metatags from '@/config/metatags'
import { ForbiddenError, UnauthorizedError } from '@/core/errors'
import MessageDetailsScreen, { MessageDetailsScreenDeny, MessageDetailsScreenSkeleton } from '@/features/publications/pages/detail/MessageDetailsScreen'
import { useGetMessage } from '@/services/publications/hook'
import { useUserStore } from '@/store/user-store'
import { useSession } from '@/ctx/SessionProvider'
import { Redirect, Stack as RouterStack, useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'
import { useHits } from '@/services/hits/hook'

const MessageDetailsPage: React.FC = () => {
  const params = useLocalSearchParams<{ id: string }>()
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href={'/(app)/(tabs)/evenements/'} />
  }

  if (!params.id) return <Error404 />

  return (
    <PageLayout webScrollable>
      <BoundarySuspenseWrapper
        fallback={<MessageDetailsScreenSkeleton />}
        errorChildren={(payload) => {
          if (payload.error instanceof UnauthorizedError || payload.error instanceof ForbiddenError) {
            return <MessageDetailsScreenDeny error={payload.error} />
          } else {
            return (
              <PageLayout.StateFrame>
                <DefaultErrorFallback {...payload} />
              </PageLayout.StateFrame>
            )
          }
        }}
      >
        <MessageDetailScreen id={params.id} />
      </BoundarySuspenseWrapper>
    </PageLayout>
  )
}

function MessageDetailScreen(props: Readonly<{ id: string }>) {
  const { defaultScope } = useUserStore()
  const { data: messageData, isLoading: isMessageLoading, error: messageError } = useGetMessage({
    messageId: props.id,
    scope: defaultScope!,
    enabled: true,
  })
  const { trackOpen } = useHits()
  const sentRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!isMessageLoading && !messageError && messageData) {
      if (sentRef.current !== props.id) {
        sentRef.current = props.id
        trackOpen({ object_type: 'publication', object_id: props.id, source: 'internal' })
      }
    }
  }, [props.id, isMessageLoading, messageError, messageData, trackOpen])

  return (
    <>
      <RouterStack.Screen
        options={{
          title: messageData?.subject || 'Détails du message',
        }}
      />
      <Head>
        <title>{metatags.createTitle(messageData?.subject || 'Détails du message')}</title>
      </Head>
      <MessageDetailsScreen data={messageData} isLoading={isMessageLoading} error={messageError} />
    </>
  )
}

export default MessageDetailsPage 