import React from 'react'
import Head from 'expo-router/head'
import { Sparkles } from '@tamagui/lucide-icons'

import { AccessDeny } from '@/components/AccessDeny'
import Header from '@/components/AppStructure/Header'
import Layout from '@/components/AppStructure/Layout/Layout'
import { RequireAuth } from '@/components/RequireAuth'
import BotPage from '@/features/bot/pages/index'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'
import { useUserScopeFeatures } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

export default function BotRoute() {
  const { isAuth } = useSession()
  const { hasFeature, isLoading } = useUserScopeFeatures({ enabled: isAuth })
  const canAccess = hasFeature(FEATURES.AI_ANTISECHE)

  return (
    <RequireAuth>
      {!canAccess && !isLoading ? (
        <Layout.Container hideSideBar hideTabBar>
          <AccessDeny />
        </Layout.Container>
      ) : (
        <>
          <Head>
            <title>{metatags.createTitle('Idée')}</title>
          </Head>
          <Header title="Nuit" icon={Sparkles} navigation={{ showBackButton: true }} style={{ showOn: 'sm' }} />
          <Layout.Container safeHorizontalPadding={false} hideTabBar>
            <BotPage />
          </Layout.Container>
        </>
      )}
    </RequireAuth>
  )
}
