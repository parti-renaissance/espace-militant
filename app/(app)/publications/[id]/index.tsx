import React from 'react'
import Error404 from '@/components/404/Error404'
import BoundarySuspenseWrapper, { DefaultErrorFallback } from '@/components/BoundarySuspenseWrapper'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import * as metatags from '@/config/metatags'
import { ForbiddenError, UnauthorizedError } from '@/core/errors'
import MessageDetailsScreen, { MessageDetailsScreenDeny, MessageDetailsScreenSkeleton } from '@/features/publications/pages/detail/MessageDetailsScreen'
import { useGetMessage } from '@/services/publications/hook'
import { useUserStore } from '@/store/user-store'
import { Stack as RouterStack, useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'
import ProfilHeader from '@/features/profil/components/PageHeader'
import { useMedia } from 'tamagui'

const MessageDetailsPage: React.FC = () => {
  const params = useLocalSearchParams<{ id: string }>()
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
  const media = useMedia()
  const { data: messageData, isLoading: isMessageLoading, error: messageError } = useGetMessage({
    messageId: props.id,
    scope: defaultScope!,
    enabled: Boolean(defaultScope)
  })

  return (
    <>
      <RouterStack.Screen
        options={{
          headerShown: media.sm ? true : false,
          header: () => <ProfilHeader title="" backgroundColor="$textSurface" forcedBackTitle="Retour" />,
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