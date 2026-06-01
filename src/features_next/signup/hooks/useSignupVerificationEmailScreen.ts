import { useSignupActivate } from '@/features_next/signup/hooks/useSignupActivate'
import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'

export function useSignupVerificationEmailScreen() {
  const email = useSignupSessionStore((s) => s.email)
  const firstName = useSignupSessionStore((s) => s.firstName)
  const inlineError = useSignupSessionStore((s) => s.inlineError)
  const { activateWithCode, isActivating } = useSignupActivate()

  return {
    email,
    firstName,
    inlineError,
    isActivating,
    needsRedirect: !email,
    onActivate: (code: string) => {
      if (email) activateWithCode(email, code)
    },
  }
}
