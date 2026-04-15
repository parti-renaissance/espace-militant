import React from 'react'
import { Redirect } from 'expo-router'

import { AccessDeny } from '@/components/AccessDeny'
import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import DraftPage from '@/features_next/publications/pages/draft'

import { useSession } from '@/ctx/SessionProvider'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

export default function PublicationsDraftPage() {
  const { isAuth } = useSession()
  const { hasFeature, isLoading } = useGetExecutiveScopes()

  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  if (!hasFeature(FEATURES.PUBLICATIONS) && !isLoading) {
    return <AccessDeny />
  }

  return (
    <>
      <Header title="Publications" />
      <Layout.Container alwaysShowScrollbar hideSideBar hideTabBar>
        <DraftPage />
      </Layout.Container>
    </>
  )
}
