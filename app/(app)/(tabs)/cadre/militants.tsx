import React from 'react'
import Head from 'expo-router/head'

import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import MilitantsScreen from '@/features_next/militants/pages/list'

import * as metatags from '@/config/metatags'

export default function MilitantsPage() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Mes militants')}</title>
      </Head>
      <Header title="Mes militants" navigation={{ showBackButton: false }} />
      <Layout.Container alwaysShowScrollbar sidebarState="cadre">
        <MilitantsScreen />
      </Layout.Container>
    </>
  )
}
