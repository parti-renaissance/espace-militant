import Head from 'expo-router/head'

import * as metatags from '@/config/metatags'
import PronoGameScreen from '@/features/prono/pages/PronoGameScreen'

export default function PronoJouerRoute() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Pronostics')}</title>
      </Head>
      <PronoGameScreen />
    </>
  )
}
