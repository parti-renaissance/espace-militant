import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Href } from 'expo-router'

import CompleteProfil from '@/features_next/profil/components/CompleteProfil'

import { useSession } from '@/ctx/SessionProvider'

export type OpenCompleteProfilOptions = {
  redirectTo?: Href
  /** Exécuté après validation du profil si `redirectTo` est absent. */
  onSuccess?: () => void
}

type CompleteProfilContextValue = {
  openCompleteProfil: (options?: OpenCompleteProfilOptions) => void
}

const CompleteProfilContext = createContext<CompleteProfilContextValue | null>(null)

export function CompleteProfilProvider({ children }: { children: ReactNode }) {
  const { isAuth } = useSession()
  const [open, setOpen] = useState(false)
  const [redirectTo, setRedirectTo] = useState<Href | undefined>()
  const onSuccessRef = useRef<(() => void) | undefined>(undefined)

  const [prevIsAuth, setPrevIsAuth] = useState(isAuth)
  if (isAuth !== prevIsAuth) {
    setPrevIsAuth(isAuth)
    if (!isAuth) {
      setOpen(false)
      setRedirectTo(undefined)
    }
  }

  useEffect(() => {
    if (!isAuth) {
      onSuccessRef.current = undefined
    }
  }, [isAuth])

  const openCompleteProfil = useCallback((options?: OpenCompleteProfilOptions) => {
    setRedirectTo(options?.redirectTo)
    onSuccessRef.current = options?.onSuccess
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setRedirectTo(undefined)
    onSuccessRef.current = undefined
  }, [])

  const handleSuccess = useCallback(() => {
    onSuccessRef.current?.()
    onSuccessRef.current = undefined
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
        <CompleteProfil open={open} onClose={handleClose} redirectTo={redirectTo} onSuccess={handleSuccess} />
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
