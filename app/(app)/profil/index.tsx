import Head from 'expo-router/head'

import Layout from '@/components/AppStructure/Layout/Layout'
import { RequireAuth } from '@/components/RequireAuth'
import DashboardScreen from '@/features/profil/pages/dashboard'

import * as metatags from '@/config/metatags'

export default function IndexPage() {
  return (
    <RequireAuth>
      <Head>
        <title>{metatags.createTitle('Profil')}</title>
      </Head>
      <Layout.Container alwaysShowScrollbar hideTabBar>
        <DashboardScreen />
      </Layout.Container>
    </RequireAuth>
  )
}
