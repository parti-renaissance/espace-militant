import Head from 'expo-router/head'

import * as metatags from '@/config/metatags'
import PronoResultScreen from '@/features_next/prono/pages/PronoResultScreen'

export default function PronoResultatRoute() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Résultat')}</title>
      </Head>
      <PronoResultScreen />
    </>
  )
}
