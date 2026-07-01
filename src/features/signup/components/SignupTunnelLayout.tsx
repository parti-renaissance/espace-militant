import { useEffect } from 'react'
import { Stack } from 'expo-router'

import { useSyncSignupRedirectUri } from '@/features/signup/hooks/useSyncSignupRedirectUri'
import { useSignupSessionStore } from '@/features/signup/store/signup-session-store'

export default function SignupTunnelLayout() {
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
