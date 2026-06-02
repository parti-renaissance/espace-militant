import { useSession } from '@/ctx/SessionProvider'
import { useSignupActivate } from '@/features_next/signup/hooks/useSignupActivate'
import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'

export function useSignupVerificationEmailScreen() {
  const email = useSignupSessionStore((s) => s.email)
  const firstName = useSignupSessionStore((s) => s.firstName)
  const inlineError = useSignupSessionStore((s) => s.inlineError)
  const setInlineError = useSignupSessionStore((s) => s.setInlineError)
  const requiresManualLogin = useSignupSessionStore((s) => s.requiresManualLogin)
  const { activateWithCode, isActivating } = useSignupActivate()
  const { signIn } = useSession()

  return {
    email,
    firstName,
    inlineError,
    isActivating,
    requiresManualLogin,
    needsRedirect: !email,
    onActivate: (code: string) => {
      if (email) activateWithCode(email, code)
    },
    onStartEditingCode: () => {
      if (inlineError) setInlineError(null)
    },
    onSignIn: () => signIn(),
  }
}
