import React, { useMemo } from 'react'
import { Redirect, useLocalSearchParams } from 'expo-router'
import { useSession } from '@/ctx/SessionProvider'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { AccessDeny } from '@/components/AccessDeny'
import { Layout } from '@/components/AppStructure'
import { useUserStore } from '@/store/user-store'
import MessageEditorPage from '@/features_next/publications/pages/create-update'

export default function PublicationsCreatePage() {
  const params = useLocalSearchParams<{ id?: string; scope?: string }>()
  const { isAuth } = useSession()
  const { hasFeature, isLoading } = useGetExecutiveScopes()
  const { defaultScope } = useUserStore()
  const isFeatureEnabled = useMemo(() => hasFeature('publications'), [hasFeature])

  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  if (!isFeatureEnabled && !isLoading) {
    return <AccessDeny />
  }

  return (
    <Layout.Container alwaysShowScrollbar hideSideBar hideTabBar safeHorizontalPadding={false}>
      <MessageEditorPage
        scope={params.scope ?? defaultScope ?? ''}
        messageId={params.id}
      />
    </Layout.Container>

  )
}

