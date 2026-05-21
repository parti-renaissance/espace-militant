import React from 'react'
import { Stack as RouterStack, useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'

import Error404 from '@/components/404/Error404'
import Layout from '@/components/AppStructure/Layout/Layout'
import BoundarySuspenseWrapper, { DefaultErrorFallback } from '@/components/BoundarySuspenseWrapper'
import ActionDetailsScreen, { ActionDetailsScreenDeny, ActionDetailsScreenSkeleton } from '@/features_next/actions/pages/detail'

import clientEnv from '@/config/clientEnv'
import * as metatags from '@/config/metatags'
import { ForbiddenError, UnauthorizedError } from '@/core/errors'
import { useAction } from '@/services/actions/hook'
import { formatActionDetailTitle } from '@/features_next/actions/utils/formatActionDetailTitle'

const BASE_URL = `https://${clientEnv.ASSOCIATED_DOMAIN}`

const ActionDetailPage: React.FC = () => {
  const params = useLocalSearchParams<{ id: string }>()
  if (!params.id) return <Error404 />
  return (
    <Layout.Container hideTabBar>
      <BoundarySuspenseWrapper
        fallback={<ActionDetailsScreenSkeleton />}
        errorChildren={(payload) => {
          if (payload.error instanceof UnauthorizedError || payload.error instanceof ForbiddenError) {
            return <ActionDetailsScreenDeny error={payload.error} />
          }
          return <DefaultErrorFallback {...payload} />
        }}
      >
        <ActionDetailInner id={params.id} />
      </BoundarySuspenseWrapper>
    </Layout.Container>
  )
}

function ActionDetailInner(props: Readonly<{ id: string }>) {
  const { data } = useAction({ id: props.id })
  const ogUrl = `${BASE_URL}/actions/${props.id}`
  const headerTitle = formatActionDetailTitle({ date: data.date, type: data.type })

  return (
    <>
      <RouterStack.Screen
        options={{
          title: headerTitle,
        }}
      />
      <Head>
        <title>{metatags.createTitle(headerTitle)}</title>
        <meta key="og-title" property="og:title" content={metatags.createTitle(headerTitle)} />
        <meta key="og-url" property="og:url" content={ogUrl} />
      </Head>
      <ActionDetailsScreen data={data} />
    </>
  )
}

export default ActionDetailPage
