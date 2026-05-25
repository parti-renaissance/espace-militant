import React from 'react'
import { Redirect } from 'expo-router'
import Head from 'expo-router/head'
import { Lightbulb } from '@tamagui/lucide-icons'

import Header from '@/components/AppStructure/Header'
import Layout from '@/components/AppStructure/Layout/Layout'
import BotPage from '@/features_next/bot/pages/index'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'
import { useGetProfil } from '@/services/profile/hook'

export default function BotRoute() {
  const { isAuth } = useSession()
  const { data: profile } = useGetProfil({ enabled: true })

  if (!isAuth) {
    return <Redirect href="/evenements" />
  }

  if (profile && !profile.canary_tester) {
    return <Redirect href="/evenements" />
  }

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Idée')}</title>
      </Head>
      <Header title="Idée" icon={Lightbulb} navigation={{ showBackButton: true }} style={{ showOn: 'sm' }} />
      <Layout.Container safeHorizontalPadding={false} hideTabBar>
        <BotPage />
      </Layout.Container>
    </>
  )
}
