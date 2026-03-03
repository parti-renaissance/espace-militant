import { useState } from 'react'

import OnboardModal from '@/features_next/onboard/components/OnboardModal'

import { useSession } from '@/ctx/SessionProvider'
import { useUserStore } from '@/store/user-store'

function OnboardModalWithState({ setOnboardingOpenedAt }: { setOnboardingOpenedAt: (date: string | null) => void }) {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setOnboardingOpenedAt(new Date().toISOString())
    setIsOpen(false)
  }

  return <OnboardModal open={isOpen} onClose={handleClose} />
}

export function OnboardConditional() {
  const { isAuth, isAdmin } = useSession()
  const needsOnboarding = useUserStore((s) => s._hasHydrated && !!s.user && s.onboardingOpenedAt == null)
  const setOnboardingOpenedAt = useUserStore((s) => s.setOnboardingOpenedAt)
  const [isLatched, setIsLatched] = useState(false)

  if (needsOnboarding && !isLatched) {
    setIsLatched(true)
  }

  if (!isAuth) return null
  if (isAdmin) return null
  if (!needsOnboarding && !isLatched) return null

  return <OnboardModalWithState setOnboardingOpenedAt={setOnboardingOpenedAt} />
}
