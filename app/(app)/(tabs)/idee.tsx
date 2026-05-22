import React from 'react'
import { Redirect } from 'expo-router'
import Head from 'expo-router/head'
import { useTranslation } from 'react-i18next'
import { Lightbulb } from '@tamagui/lucide-icons'

import Header from '@/components/AppStructure/Header'
import Layout from '@/components/AppStructure/Layout/Layout'
import BotPage from '@/features_next/bot/pages/index'

import clientEnv from '@/config/clientEnv'
import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'
import { useGetProfil } from '@/services/profile/hook'

export default function IdeePage() {
  const { isAuth } = useSession()
  const { data: profile } = useGetProfil({ enabled: true })
  const { t } = useTranslation()

  if (!isAuth) {
    return <Redirect href="/evenements" />
  }

  // canary tester ou staging
  const canAccess = clientEnv.ENVIRONMENT === 'staging' || profile?.canary_tester === true
  if (profile && !canAccess) {
    return <Redirect href="/evenements" />
  }

  return (
    <>
      <Head>
        <title>{metatags.createTitle(t('bot.title'))}</title>
      </Head>
      <Header title={t('bot.title')} icon={Lightbulb} navigation={{ showBackButton: false }} style={{ showOn: 'sm' }} />
      <Layout.Container safeHorizontalPadding={false}>
        <BotPage />
      </Layout.Container>
    </>
  )
}
