import React from 'react'
import { Redirect } from "expo-router";
import Head from 'expo-router/head';
import { useSession } from "@/ctx/SessionProvider";
import { useGetExecutiveScopes } from "@/services/profile/hook";
import { AccessDeny } from "@/components/AccessDeny";
import Layout from '@/components/AppStructure/Layout/Layout'
import MessagePageIndex from '@/features_next/publications/pages/index'
import { Header } from '@/components/AppStructure';
import * as metatags from '@/config/metatags';

export default function PublicationsPage() {
  const { isAuth } = useSession()
  const { hasFeature } = useGetExecutiveScopes()

  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  if (!hasFeature('publications')) {
    return <AccessDeny />
  }

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Publications')}</title>
      </Head>
      <Header title="Publications" />
      <Layout.Container alwaysShowScrollbar>
        <MessagePageIndex />
      </Layout.Container>
    </>
  )
}

