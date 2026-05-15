import React from 'react'
import { Redirect } from 'expo-router'
import Head from 'expo-router/head'

import Layout from '@/components/AppStructure/Layout/Layout'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { ActionForm, ActionFormScreenSkeleton } from '@/features_next/actions'

import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'

const CreateActionScreen: React.FC = () => {
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href="/evenements/list" />
  }

  return (
    <Layout.Container hideSideBar hideTabBar>
      <BoundarySuspenseWrapper fallback={<ActionFormScreenSkeleton />}>
        <Head>
          <title>{metatags.createTitle('Nouvelle action')}</title>
        </Head>
        <ActionForm />
      </BoundarySuspenseWrapper>
    </Layout.Container>
  )
}

export default CreateActionScreen
