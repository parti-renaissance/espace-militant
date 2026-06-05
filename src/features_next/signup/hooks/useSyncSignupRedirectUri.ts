import { useLocalSearchParams } from 'expo-router'

import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'

export function useSyncSignupRedirectUri() {
  const { redirectUri } = useLocalSearchParams<{ redirectUri?: string }>()
  const safeRedirectUri =
    typeof redirectUri === 'string' && redirectUri.startsWith('/') && !redirectUri.startsWith('//') ? redirectUri : undefined

  if (safeRedirectUri && useSignupSessionStore.getState().redirectUri !== safeRedirectUri) {
    useSignupSessionStore.getState().setRedirectUri(safeRedirectUri)
  }
}
