import React from 'react'
import { Redirect } from 'expo-router'

import { useSession } from '@/ctx/SessionProvider'

export default function APage() {
  const { isAuth, isLoading } = useSession()

  // Fix React Navigation

  if (isLoading) {
    return null
  }

  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  return <Redirect href={'/'} />
}
