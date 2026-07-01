import React from 'react'
import { router, Stack as RouterStack, useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'

import BoundarySuspenseWrapper, { DefaultErrorFallback } from '@/components/BoundarySuspenseWrapper'
import { formatActionDetailTitle } from '@/features/actions/pages/detail/helpers/formatActionDetailTitle'

import clientEnv from '@/config/clientEnv'
import * as metatags from '@/config/metatags'
import type { DetailedAPIErrorPayload } from '@/core/errors'
import { ForbiddenError, UnauthorizedError } from '@/core/errors'
import { useSession } from '@/ctx/SessionProvider'
import { useAction } from '@/services/actions/hook'
import type { RestActionFull } from '@/services/actions/schema'

import { ActionContent } from './components/ActionContent'
import { ActionDenyScreen } from './components/ActionDenyScreen'
import { ActionDetailsScreenLock } from './components/ActionDetailsScreenLock'
import { ActionSkeleton } from './components/ActionSkeleton'
import { GreetingCreateModal } from './components/GreetingCreateModal'

const BASE_URL = `https://${clientEnv.ASSOCIATED_DOMAIN}`

export default function ActionDetailsScreen({ data, isFetching = false }: { data: RestActionFull; isFetching?: boolean }) {
  const { greet } = useLocalSearchParams<{ greet: string }>()
  const setIsGreet = () => {
    router.setParams({ greet: undefined })
  }

  return (
    <>
      <GreetingCreateModal action={data} modalProps={{ open: greet === 'new', onClose: setIsGreet }} />
      <ActionContent data={data} isFetching={isFetching} />
    </>
  )
}

export function ActionDetailsScreenSkeleton() {
  return <ActionSkeleton />
}

export function ActionDetailsScreenDeny({ error }: { error: DetailedAPIErrorPayload }) {
  if (error instanceof UnauthorizedError) {
    return <ActionDetailsScreenLock />
  }
  return <ActionDenyScreen error={error} />
}

export { ActionDetailsScreenLock }

type ActionDetailPageProps = {
  id: string
}

function ActionDetailAuthenticated({ id }: ActionDetailPageProps) {
  const { data, isFetching } = useAction({ id })
  const ogUrl = `${BASE_URL}/actions/${id}`
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
      <ActionDetailsScreen data={data} isFetching={isFetching} />
    </>
  )
}

export function ActionDetailPage({ id }: ActionDetailPageProps) {
  const { isAuth, isLoading } = useSession()

  if (isLoading) {
    return null
  }

  if (!isAuth) {
    return <ActionDetailsScreenLock />
  }

  return (
    <BoundarySuspenseWrapper
      fallback={<ActionSkeleton />}
      errorChildren={(payload) => {
        if (payload.error instanceof UnauthorizedError) {
          return <ActionDetailsScreenLock />
        }
        if (payload.error instanceof ForbiddenError) {
          return <ActionDenyScreen error={payload.error} />
        }
        return <DefaultErrorFallback {...payload} />
      }}
    >
      <ActionDetailAuthenticated id={id} />
    </BoundarySuspenseWrapper>
  )
}
