import React from 'react'
import Head from 'expo-router/head'

import Layout from '@/components/AppStructure/Layout/Layout'
import TicketScannerPage from '@/features/tickets-scanner/pages'

import * as metatags from '@/config/metatags'

function ScannerScreen() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Scanner de billets')}</title>
      </Head>
      <Layout.Container hideSideBar hideTabBar>
        <TicketScannerPage />
      </Layout.Container>
    </>
  )
}

export default ScannerScreen
