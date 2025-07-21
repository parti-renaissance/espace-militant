import React from 'react'
import { Redirect, useLocalSearchParams } from 'expo-router'
import { useSession } from '@/ctx/SessionProvider'
import MessageEditorPage from '@/features/publications/pages/create-update'
import { useUserStore } from '@/store/user-store'

export default function () {
  const params = useLocalSearchParams<{ id?: string; scope?: string }>()
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href={'/(app)/(tabs)/evenements/'} />
  }

  const { defaultScope } = useUserStore()
  
  return <MessageEditorPage 
    scope={params.scope ?? defaultScope ?? ''} 
    messageId={params.id}
  />
} 