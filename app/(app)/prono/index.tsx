import Head from 'expo-router/head'

import * as metatags from '@/config/metatags'
import PronoPublicScreen from '@/features_next/prono/pages/PronoPublicScreen'

export default function PronoRoute() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Pronostics')}</title>
      </Head>
      <PronoPublicScreen />
    </>
  )
}
