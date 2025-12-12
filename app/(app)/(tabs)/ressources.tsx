import React from 'react'
import { Redirect } from 'expo-router'
import Head from 'expo-router/head'
import { Link2 } from '@tamagui/lucide-icons'
import Layout from '@/components/AppStructure/Layout/Layout'
import Header from '@/components/AppStructure/Header'
import ResourcesScreen from '@/features_next/resources/pages/index'
import { useSession } from '@/ctx/SessionProvider'
import * as metatags from '@/config/metatags'

export default function RessourcesPage() {
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Ressources')}</title>
      </Head>
      <Header title="Ressources" icon={Link2} navigation={{ showBackButton: false }} style={{ showOn: 'sm' }} />
      <Layout.Container safeHorizontalPadding={false}>
        <ResourcesScreen />
      </Layout.Container>
    </>
  )
}