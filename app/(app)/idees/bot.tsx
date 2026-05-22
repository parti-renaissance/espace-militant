import React from 'react'
import { Redirect } from 'expo-router'
import Head from 'expo-router/head'
import { useTranslation } from 'react-i18next'
import { Lightbulb } from '@tamagui/lucide-icons'

import Header from '@/components/AppStructure/Header'
import Layout from '@/components/AppStructure/Layout/Layout'
import BotPage from '@/features_next/bot/pages/index'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'

export default function BotRoute() {
  const { isAuth } = useSession()
  const { t } = useTranslation()

  if (!isAuth) {
    return <Redirect href="/evenements" />
  }

  return (
    <>
      <Head>
        <title>{metatags.createTitle(t('bot.title'))}</title>
      </Head>
      <Header title={t('bot.title')} icon={Lightbulb} navigation={{ showBackButton: true }} style={{ showOn: 'sm' }} />
      <Layout.Container safeHorizontalPadding={false} hideTabBar>
        <BotPage />
      </Layout.Container>
    </>
  )
}
