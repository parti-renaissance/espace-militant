import React, { useMemo } from 'react'
import { Redirect } from 'expo-router'
import Head from 'expo-router/head'

import { AccessDeny } from '@/components/AccessDeny'
import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import MessagePageIndex from '@/features_next/publications/pages/index'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

export default function PublicationsPage() {
  const { isAuth } = useSession()
  const { hasFeature, isLoading } = useGetExecutiveScopes()
  const isFeatureEnabled = useMemo(() => hasFeature(FEATURES.PUBLICATIONS), [hasFeature])

  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  if (!isFeatureEnabled && !isLoading) {
    return <AccessDeny />
  }

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Publications')}</title>
      </Head>
      <Header title="Publications" />
      <Layout.Container alwaysShowScrollbar hideSideBar hideTabBar>
        <MessagePageIndex />
      </Layout.Container>
    </>
  )
}
