import React from 'react'
import { Redirect } from 'expo-router'
import Head from 'expo-router/head'

import { AccessDeny } from '@/components/AccessDeny'
import Layout from '@/components/AppStructure/Layout/Layout'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import ActionForm, { ActionFormScreenSkeleton } from '@/features/actions/pages/create-edit'
import RequireCompleteProfileGate from '@/features/profil/components/RequireCompleteProfileGate'
import { CREER_ACTION_HREF } from '@/features/profil/profileCompletion'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'
import { useUserScopeFeatures } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

const CreateActionScreen: React.FC = () => {
  const { isAuth } = useSession()
  const { hasFeature, isLoading } = useUserScopeFeatures({ enabled: isAuth })
  const canCreate = hasFeature(FEATURES.ACTIONS)

  if (!isAuth) {
    return <Redirect href="/evenements/list" />
  }

  if (isLoading) {
    return (
      <Layout.Container hideSideBar hideTabBar>
        <BoundarySuspenseWrapper fallback={<ActionFormScreenSkeleton />}>
          <ActionFormScreenSkeleton />
        </BoundarySuspenseWrapper>
      </Layout.Container>
    )
  }

  if (!canCreate) {
    return (
      <Layout.Container hideSideBar hideTabBar>
        <AccessDeny />
      </Layout.Container>
    )
  }

  return (
    <Layout.Container hideSideBar hideTabBar>
      <RequireCompleteProfileGate redirectTo={CREER_ACTION_HREF}>
        <BoundarySuspenseWrapper fallback={<ActionFormScreenSkeleton />}>
          <Head>
            <title>{metatags.createTitle('Nouvelle action')}</title>
          </Head>
          <ActionForm />
        </BoundarySuspenseWrapper>
      </RequireCompleteProfileGate>
    </Layout.Container>
  )
}

export default CreateActionScreen
