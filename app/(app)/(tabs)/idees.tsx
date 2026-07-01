import React from 'react'
import Head from 'expo-router/head'

import Layout from '@/components/AppStructure/Layout/Layout'
import IdeesScreen from '@/features/ideas/pages/index'

import * as metatags from '@/config/metatags'

export default function IdeesPage() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Débattre')}</title>
      </Head>
      <Layout.Container backgroundColor="$gray50" safeHorizontalPadding={false}>
        <IdeesScreen />
      </Layout.Container>
    </>
  )
}
