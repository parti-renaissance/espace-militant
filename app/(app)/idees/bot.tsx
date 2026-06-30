import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'
import { Sparkles } from '@tamagui/lucide-icons'

import { AccessDeny } from '@/components/AccessDeny'
import Header from '@/components/AppStructure/Header'
import Layout from '@/components/AppStructure/Layout/Layout'
import { RequireAuth } from '@/components/RequireAuth'
import BotPage from '@/features_next/bot/pages/index'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'
import { useUserScopeFeatures } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

export default function BotRoute() {
  const { isAuth } = useSession()
  const params = useLocalSearchParams<Record<string, string | string[]>>()
  const { hasFeature, isLoading } = useUserScopeFeatures({ enabled: isAuth })
  const canAccess = hasFeature(FEATURES.AI_ANTISECHE)
  const redirectPath = React.useMemo(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      return `${window.location.pathname}${window.location.search}`
    }

    const urlQuestion = Object.keys(params)[0]?.trim()
    return urlQuestion ? `/idees/bot?${encodeURIComponent(urlQuestion)}` : undefined
  }, [params])

  return (
    <RequireAuth redirectPath={redirectPath}>
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
