import Head from 'expo-router/head'

import VerificationEmailPage from '@/features_next/signup/pages/verification-email'

import * as metatags from '@/config/metatags'

export default function SignupVerificationEmailRoute() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Vérification e-mail')}</title>
      </Head>
      <VerificationEmailPage />
    </>
  )
}
