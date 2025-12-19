import React from 'react'
import { Redirect } from 'expo-router'
import Head from 'expo-router/head'
import Layout from '@/components/AppStructure/Layout/Layout'
import { useSession } from '@/ctx/SessionProvider'
import FormationsScreen from '@/features_next/formations/pages/index'
import * as metatags from '@/config/metatags'

export default function FormationsPage() {
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Formations')}</title>
      </Head>
      <Layout.Container>
        <FormationsScreen />
      </Layout.Container>
    </>
  )
}
