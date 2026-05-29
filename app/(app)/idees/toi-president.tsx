import React from 'react'
import { Redirect } from 'expo-router'
import Head from 'expo-router/head'
import { Dices } from '@tamagui/lucide-icons'

import Header from '@/components/AppStructure/Header'
import Layout from '@/components/AppStructure/Layout/Layout'
import ToiPresidentGameScreen from '@/features_next/ideas/pages/toiPresident'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'

export default function ToiPresidentRoute() {
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href="/evenements" />
  }

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Toi président')}</title>
      </Head>
      <Header title="Toi président" icon={Dices} navigation={{ showBackButton: true }} style={{ showOn: 'sm' }} />
      <Layout.Container safeHorizontalPadding={false} hideTabBar>
        <ToiPresidentGameScreen />
      </Layout.Container>
    </>
  )
}
