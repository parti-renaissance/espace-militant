import { useEffect } from 'react'
import { useGlobalSearchParams } from 'expo-router'

import { useSignupSessionStore } from '@/features/signup/store/signup-session-store'

export function useSyncSignupRedirectUri() {
  const { redirectUri, ref, utm_source } = useGlobalSearchParams<{ redirectUri?: string; ref?: string; utm_source?: string }>()
  const safeRedirectUri =
    typeof redirectUri === 'string' && redirectUri.startsWith('/') && !redirectUri.startsWith('//') ? redirectUri : undefined
  const safeRef = typeof ref === 'string' && ref.length > 0 ? ref : undefined
  const safeUtmSource = typeof utm_source === 'string' && utm_source.length > 0 ? utm_source : undefined

  useEffect(() => {
    const store = useSignupSessionStore.getState()

    if (safeRedirectUri && store.redirectUri !== safeRedirectUri) {
      store.setRedirectUri(safeRedirectUri)
    }

    if (safeRef && store.ref !== safeRef) {
      store.setRef(safeRef)
    }

    if (safeUtmSource && store.utmSource !== safeUtmSource) {
      store.setUtmSource(safeUtmSource)
    }
  }, [safeRedirectUri, safeRef, safeUtmSource])
}
