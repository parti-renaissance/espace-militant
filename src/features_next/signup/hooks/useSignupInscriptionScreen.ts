import { useRef } from 'react'
import { Href, router } from 'expo-router'

import type { SignupInscriptionFormHandle } from '@/features_next/signup/pages/SignupInscriptionScreen/components/SignupInscriptionForm'
import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'

import { useSignup } from '@/services/signup/hook'
import { useUserStore } from '@/store/user-store'

export function useSignupInscriptionScreen() {
  const formRef = useRef<SignupInscriptionFormHandle>(null)
  const { isPending: isSubmitting } = useSignup()
  const setSignupTunnelSkipped = useUserStore((s) => s.setSignupTunnelSkipped)
  const resetSignupSession = useSignupSessionStore((s) => s.reset)

  const handleSkip = () => {
    setSignupTunnelSkipped()
    resetSignupSession()
    router.replace('/evenements' as Href)
  }

  const handleSuccess = () => {
    router.push('/(signup)/verification-email')
  }

  return {
    formRef,
    isSubmitting,
    handleSkip,
    handleSuccess,
  }
}
