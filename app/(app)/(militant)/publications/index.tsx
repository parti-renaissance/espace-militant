import React from 'react'
import { Redirect } from "expo-router";
import { useSession } from "@/ctx/SessionProvider";
import { useGetExecutiveScopes } from "@/services/profile/hook";
import { AccessDeny } from "@/components/AccessDeny";
import Layout from '@/components/AppStructure/Layout/Layout'
import MessagePageIndex from '@/features_next/publications/pages/index'

export default function PublicationsPage() {
  const { isAuth } = useSession()
  const { hasFeature } = useGetExecutiveScopes()

  if (!isAuth) {
    return <Redirect href={'/(app)/(tabs)/evenements/'} />
  }

  if (!hasFeature('publications')) {
    return <AccessDeny />
  }

  return (
    <Layout.Container>
      <MessagePageIndex />
    </Layout.Container>
  )
}

