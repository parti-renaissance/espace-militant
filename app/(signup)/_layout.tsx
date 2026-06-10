import { useEffect } from 'react'
import { Stack } from 'expo-router'

import { useSyncSignupRedirectUri } from '@/features_next/signup/hooks/useSyncSignupRedirectUri'
import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'

export default function SignupLayout() {
  useSyncSignupRedirectUri()

  useEffect(() => {
    return () => useSignupSessionStore.getState().reset()
  }, [])

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'simple_push' }} initialRouteName="bienvenue">
      <Stack.Screen name="bienvenue" />
      <Stack.Screen name="inscription" />
      <Stack.Screen name="verification-email" />
    </Stack>
  )
}
