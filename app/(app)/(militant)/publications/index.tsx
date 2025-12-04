import React from 'react'
import { Redirect } from "expo-router";
import { useSession } from "@/ctx/SessionProvider";
import { useGetExecutiveScopes } from "@/services/profile/hook";
import { AccessDeny } from "@/components/AccessDeny";
import Layout from '@/components/AppStructure/Layout/Layout'
import MessagePageIndex from '@/features_next/publications/pages/index'
import { Header } from '@/components/AppStructure';

export default function PublicationsPage() {
  const { isAuth } = useSession()
  const { hasFeature, isLoading } = useGetExecutiveScopes()

  if (!isAuth) {
    return <Redirect href={'/(app)/(tabs)/evenements/'} />
  }

  if (!hasFeature('publications') && !isLoading) {
    return <AccessDeny />
  }

  return (
    <>
      <Header title="Publications" />
      <Layout.Container alwaysShowScrollbar>
        <MessagePageIndex />
      </Layout.Container>
    </>
  )
}

