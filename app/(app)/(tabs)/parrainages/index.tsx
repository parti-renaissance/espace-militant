import React from 'react'
import Head from 'expo-router/head'
import * as metatags from '@/config/metatags'
import ReferralScreen from '@/features/referrals'

function ReferralsScreen() {

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Parrainages')}</title>
      </Head>
      <ReferralScreen />
    </>
  )
}

export default ReferralsScreen