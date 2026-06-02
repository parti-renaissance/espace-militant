import React from 'react'
import { Redirect } from 'expo-router'
import Head from 'expo-router/head'
import { Sparkles } from '@tamagui/lucide-icons'

import { AccessDeny } from '@/components/AccessDeny'
import Header from '@/components/AppStructure/Header'
import Layout from '@/components/AppStructure/Layout/Layout'
import BotPage from '@/features_next/bot/pages/index'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'
import { useUserScopeFeatures } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

export default function BotRoute() {
  const { isAuth } = useSession()
  const { hasFeature, isLoading } = useUserScopeFeatures({ enabled: isAuth })
  const canAccess = hasFeature(FEATURES.AI_ANTISECHE)

  if (!isAuth) {
    return <Redirect href="/evenements" />
  }

  if (!canAccess && !isLoading) {
    return (
      <Layout.Container hideSideBar hideTabBar>
        <AccessDeny />
      </Layout.Container>
    )
  }

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Idée')}</title>
      </Head>
      <Header title="Nuit" icon={Sparkles} navigation={{ showBackButton: true }} style={{ showOn: 'sm' }} />
      <Layout.Container safeHorizontalPadding={false} hideTabBar>
        <BotPage />
      </Layout.Container>
    </>
  )
}
