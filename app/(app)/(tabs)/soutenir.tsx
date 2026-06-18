import React from 'react'
import Head from 'expo-router/head'

import Layout from '@/components/AppStructure/Layout/Layout'
import SoutenirScreen from '@/features_next/soutenir/pages/index'

import * as metatags from '@/config/metatags'

export default function SoutenirPage() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Soutenir')}</title>
      </Head>
      <Layout.Container>
        <SoutenirScreen />
      </Layout.Container>
    </>
  )
}
