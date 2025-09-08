import React from 'react'
import Head from 'expo-router/head'
import * as metatags from '@/config/metatags'
import TicketScannerPage from '@/features/tickets-scanner/pages'

function ScannerScreen() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Scanner de billets')}</title>
      </Head>
      <TicketScannerPage />
    </>
  )
}

export default ScannerScreen