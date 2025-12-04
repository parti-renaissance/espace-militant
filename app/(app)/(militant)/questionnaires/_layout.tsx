import React from 'react'
import { Redirect, Stack } from 'expo-router'
import { useSession } from '@/ctx/SessionProvider'

export default function ProfilLayout() {
  const { isAuth } = useSession()
  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'simple_push',
        fullScreenGestureEnabled: true,
        contentStyle: {
          backgroundColor: '#fafafb',
        },
      }}
      initialRouteName="index"
    />
  )
}

