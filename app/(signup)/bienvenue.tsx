import Head from 'expo-router/head'

import BienvenuePage from '@/features_next/signup/pages/bienvenue'

import * as metatags from '@/config/metatags'

export default function SignupBienvenueRoute() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Bienvenue')}</title>
      </Head>
      <BienvenuePage />
    </>
  )
}
