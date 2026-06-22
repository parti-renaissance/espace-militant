import { useMemo } from 'react'

import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'

import { getInscriptionContent } from '../config'

export function useInscriptionContent() {
  const redirectUri = useSignupSessionStore((s) => s.redirectUri)

  return useMemo(() => getInscriptionContent(redirectUri), [redirectUri])
}
