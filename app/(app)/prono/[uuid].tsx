import { Redirect, useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'

import Error404 from '@/components/404/Error404'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import PronoDetailScreen from '@/features_next/prono/pages/PronoDetailScreen'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'

export default function PronoDetailRoute() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>()
  const { isAuth, isLoading } = useSession()

  if (!uuid) return <Error404 />
  if (isLoading) return null
  if (!isAuth) return <Redirect href="/prono" />

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Pronostics')}</title>
      </Head>
      <BoundarySuspenseWrapper>
        <PronoDetailScreen uuid={uuid} />
      </BoundarySuspenseWrapper>
    </>
  )
}
