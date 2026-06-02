import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'

import { useSession } from '@/ctx/SessionProvider'
import CompleteProfil from '@/features_next/profil/components/CompleteProfil'

type CompleteProfilContextValue = {
  openCompleteProfil: () => void
}

const CompleteProfilContext = createContext<CompleteProfilContextValue | null>(null)

export function CompleteProfilProvider({ children }: { children: ReactNode }) {
  const { isAuth } = useSession()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isAuth) {
      setOpen(false)
    }
  }, [isAuth])

  const openCompleteProfil = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      openCompleteProfil,
    }),
    [openCompleteProfil],
  )

  return (
    <CompleteProfilContext.Provider value={value}>
      {children}
      {isAuth ? (
        <BoundarySuspenseWrapper fallback={null}>
          <CompleteProfil open={open} onClose={handleClose} />
        </BoundarySuspenseWrapper>
      ) : null}
    </CompleteProfilContext.Provider>
  )
}

export function useCompleteProfil() {
  const context = useContext(CompleteProfilContext)

  if (!context) {
    throw new Error('useCompleteProfil must be used within CompleteProfilProvider')
  }

  return context
}
