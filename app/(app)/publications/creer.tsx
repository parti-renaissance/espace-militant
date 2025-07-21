import React from 'react'
import Error404 from '@/components/404/Error404'
import LayoutPage from '@/components/layouts/PageLayout/PageLayout'
import { useSession } from '@/ctx/SessionProvider'
import MessageEditorPage from '@/features/publications/pages/create-update'
import { useGetMessageContent } from '@/services/publications/hook'
import { useUserStore } from '@/store/user-store'
import { Redirect, useLocalSearchParams } from 'expo-router'

export default function () {
  const params = useLocalSearchParams<{ id?: string; scope?: string }>()
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href={'/(app)/(tabs)/evenements/'} />
  }

  const { defaultScope } = useUserStore()
  
  return <MessageEditorPage 
    scope={params.scope} 
    messageId={params.id}
  />
} 