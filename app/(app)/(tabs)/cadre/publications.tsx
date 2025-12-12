import React from 'react'
import Layout from '@/components/AppStructure/Layout/Layout'
import PublicationsScreen from '@/features_next/publications/pages/list'
import Head from 'expo-router/head'
import * as metatags from '@/config/metatags'

export default function PublicationsPage() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Publications')}</title>
      </Head>
      <Layout.Container sidebarState="cadre">
        <PublicationsScreen />
      </Layout.Container>
    </>

  )
}

