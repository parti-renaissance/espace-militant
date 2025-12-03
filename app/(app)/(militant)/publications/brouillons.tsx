import React from 'react'
import { Redirect } from "expo-router";
import { useSession } from "@/ctx/SessionProvider";
import { useGetExecutiveScopes } from "@/services/profile/hook";
import { AccessDeny } from "@/components/AccessDeny";
import Layout from '@/components/AppStructure/Layout/Layout'
import DraftPage from '@/features_next/publications/pages/draft'

export default function PublicationsDraftPage() {
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
      <DraftPage />
    </Layout.Container>
  )
}

