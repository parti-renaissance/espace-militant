import { useEffect } from 'react'
import { useGlobalSearchParams } from 'expo-router'

import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'

export function useSyncSignupRedirectUri() {
  const { redirectUri, ref } = useGlobalSearchParams<{ redirectUri?: string; ref?: string }>()
  const safeRedirectUri =
    typeof redirectUri === 'string' && redirectUri.startsWith('/') && !redirectUri.startsWith('//') ? redirectUri : undefined
  const safeRef = typeof ref === 'string' && ref.length > 0 ? ref : undefined

  useEffect(() => {
    const store = useSignupSessionStore.getState()

    if (safeRedirectUri && store.redirectUri !== safeRedirectUri) {
      store.setRedirectUri(safeRedirectUri)
    }

    if (safeRef && store.ref !== safeRef) {
      store.setRef(safeRef)
    }
  }, [safeRedirectUri, safeRef])
}
