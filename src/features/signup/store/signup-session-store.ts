import { create } from 'zustand'

import { SIGNUP_RESEND_COOLDOWN_MS } from '@/services/signup/constants'

/**
 * État partagé entre les écrans du tunnel signup.
 * Les étapes du parcours sont les routes Expo (`bienvenue` → `inscription` → `verification-email`).
 */
type SignupSessionState = {
  email: string
  firstName: string
  redirectUri: string | null
  ref: string | null
  utmSource: string | null
  inlineError: string | null
  requiresManualLogin: boolean
  resendAvailableAt: number | null
  setEmail: (email: string) => void
  setFirstName: (firstName: string) => void
  setRedirectUri: (redirectUri: string | null) => void
  setRef: (ref: string | null) => void
  setUtmSource: (utmSource: string | null) => void
  setInlineError: (message: string | null) => void
  setRequiresManualLogin: (value: boolean) => void
  startResendCooldown: () => void
  reset: () => void
}

const initialState = {
  email: '',
  firstName: '',
  redirectUri: null as string | null,
  ref: null as string | null,
  utmSource: null as string | null,
  inlineError: null as string | null,
  requiresManualLogin: false,
  resendAvailableAt: null as number | null,
}

export const useSignupSessionStore = create<SignupSessionState>((set) => ({
  ...initialState,
  setEmail: (email) => set({ email }),
  setFirstName: (firstName) => set({ firstName }),
  setRedirectUri: (redirectUri) => set({ redirectUri }),
  setRef: (ref) => set({ ref }),
  setUtmSource: (utmSource) => set({ utmSource }),
  setInlineError: (inlineError) => set({ inlineError }),
  setRequiresManualLogin: (requiresManualLogin) => set({ requiresManualLogin }),
  startResendCooldown: () => set({ resendAvailableAt: Date.now() + SIGNUP_RESEND_COOLDOWN_MS }),
  reset: () => set(initialState),
}))

export function getResendSecondsLeft(resendAvailableAt: number | null): number {
  if (!resendAvailableAt) return 0
  return Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000))
}

export function isResendCooldownActive(resendAvailableAt: number | null): boolean {
  return getResendSecondsLeft(resendAvailableAt) > 0
}
