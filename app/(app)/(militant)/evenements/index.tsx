import React from 'react'
import Head from 'expo-router/head'
import Layout from '@/components/AppStructure/Layout/Layout'
import EventFeed from '@/features_next/events/pages/feed'
import * as metatags from '@/config/metatags'

export default function EvenementsPage() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Nos événements')}</title>
      </Head>
      <Layout.Container>
        <EvenementsContent />
      </Layout.Container>
    </>
  )
}

function EvenementsContent() {
  return (
    <EventFeed />
  )
}