import { useCallback, useEffect, useState } from 'react'
import { Asset } from 'expo-asset'
import { router, useFocusEffect } from 'expo-router'

import illuInscription from '@/features/signup/assets/illu-inscription.jpg'
import { useSignupSessionStore } from '@/features/signup/store/signup-session-store'
import { AuthRoutes, getAuthHref } from '@/features/signup/utils/authNavigation'
import { SIGNUP_BIENVENUE_VIDEO_UUID } from '@/services/signup/constants'
import { useVideo } from '@/services/video/hook'

export function useSignupBienvenueScreen() {
  const { data, isLoading, isError } = useVideo(SIGNUP_BIENVENUE_VIDEO_UUID)
  const [isScreenFocused, setIsScreenFocused] = useState(true)

  useEffect(() => {
    Asset.loadAsync([illuInscription]).catch(() => null)
  }, [])

  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true)
      return () => setIsScreenFocused(false)
    }, []),
  )

  const handleContinue = useCallback(() => {
    setIsScreenFocused(false)
    const { redirectUri, ref, utmSource } = useSignupSessionStore.getState()
    router.replace(
      getAuthHref(AuthRoutes.INSCRIPTION, {
        redirectUri: redirectUri ?? undefined,
        ref: ref ?? undefined,
        utm_source: utmSource ?? undefined,
      }),
    )
  }, [])

  return {
    data,
    isLoading,
    isError,
    isScreenFocused,
    handleContinue,
  }
}
