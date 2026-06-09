import { useCallback, useEffect, useState } from 'react'
import { Asset } from 'expo-asset'
import { router, useFocusEffect } from 'expo-router'

import illuInscription from '@/features_next/signup/assets/illu-inscription.jpg'
import { useSyncSignupRedirectUri } from '@/features_next/signup/hooks/useSyncSignupRedirectUri'
import { AuthRoutes, getAuthHref } from '@/features_next/signup/utils/authNavigation'
import { SIGNUP_BIENVENUE_VIDEO_UUID } from '@/services/signup/constants'
import { useVideo } from '@/services/video/hook'

export function useSignupBienvenueScreen() {
  const { data, isLoading, isError } = useVideo(SIGNUP_BIENVENUE_VIDEO_UUID)
  const [isScreenFocused, setIsScreenFocused] = useState(true)
  useSyncSignupRedirectUri()

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
    router.replace(getAuthHref(AuthRoutes.INSCRIPTION))
  }, [])

  return {
    data,
    isLoading,
    isError,
    isScreenFocused,
    handleContinue,
  }
}
