import Head from 'expo-router/head'

import InscriptionPage from '@/features_next/signup/pages/inscription'

import * as metatags from '@/config/metatags'

export default function SignupInscriptionRoute() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Inscription')}</title>
      </Head>
      <InscriptionPage />
    </>
  )
}
