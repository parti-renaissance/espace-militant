import Head from 'expo-router/head'
import Layout from '@/components/AppStructure/Layout/Layout'
import DashboardScreen from '@/features_next/profil/pages/dashboard'
import * as metatags from '@/config/metatags'

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Profil')}</title>
      </Head>
      <Layout.Container alwaysShowScrollbar>
        <DashboardScreen />
      </Layout.Container>
    </>
  )
}
