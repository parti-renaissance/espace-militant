import React from 'react'
import { Redirect } from 'expo-router'
import Head from 'expo-router/head'
import { HeartHandshake } from '@tamagui/lucide-icons'

import Header from '@/components/AppStructure/Header'
import Layout from '@/components/AppStructure/Layout/Layout'
import ReferralsScreen from '@/features_next/referrals/pages/index/index'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'

export default function ParrainagesPage() {
  const { isAuth } = useSession()
  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Parrainages')}</title>
      </Head>
      <Header title="Parrainages" icon={HeartHandshake} navigation={{ showBackButton: false }} style={{ showOn: 'sm' }} />
      <Layout.Container safeHorizontalPadding={false}>
        <ReferralsScreen />
      </Layout.Container>
    </>
  )
}
