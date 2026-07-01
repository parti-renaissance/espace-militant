import { useSession } from '@/ctx/SessionProvider'
import { useSignupActivate } from '@/features/signup/hooks/useSignupActivate'
import { useSignupSessionStore } from '@/features/signup/store/signup-session-store'

import { useResendSignupCode } from '@/services/signup/hook'

export function useSignupVerificationEmailScreen() {
  const email = useSignupSessionStore((s) => s.email)
  const firstName = useSignupSessionStore((s) => s.firstName)
  const inlineError = useSignupSessionStore((s) => s.inlineError)
  const setInlineError = useSignupSessionStore((s) => s.setInlineError)
  const setEmail = useSignupSessionStore((s) => s.setEmail)
  const startResendCooldown = useSignupSessionStore((s) => s.startResendCooldown)
  const requiresManualLogin = useSignupSessionStore((s) => s.requiresManualLogin)
  const redirectUri = useSignupSessionStore((s) => s.redirectUri)
  const { activateWithCode, isActivating } = useSignupActivate()
  const { mutateAsync: resendCode, isPending: isChangingEmail } = useResendSignupCode()
  const { signIn } = useSession()

  return {
    email,
    firstName,
    inlineError,
    isActivating,
    isChangingEmail,
    requiresManualLogin,
    needsRedirect: !email,
    onActivate: (code: string) => {
      if (email) activateWithCode(email, code)
    },
    onStartEditingCode: () => {
      if (inlineError) setInlineError(null)
    },
    onChangeEmail: async (nextEmail: string) => {
      const trimmed = nextEmail.trim()
      await resendCode({ email: trimmed })
      setEmail(trimmed)
      startResendCooldown()
    },
    onSignIn: () => signIn({ state: redirectUri || '/' }),
  }
}
