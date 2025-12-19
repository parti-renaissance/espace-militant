import Head from 'expo-router/head'
import Layout from '@/components/AppStructure/Layout/Layout'
import DashboardScreen from '@/features_next/profil/pages/dashboard'
import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'
import { Redirect } from 'expo-router'

export default function IndexPage() {
  const { isAuth } = useSession()
  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }
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
