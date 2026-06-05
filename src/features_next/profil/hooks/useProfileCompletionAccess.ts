import { useCallback } from 'react'
import type { Href } from 'expo-router'

import { useRequireAuth } from '@/components/RequireAuth'
import { useProfileCompletion } from '@/services/profile/hook'

import { useCompleteProfil } from '../context/CompleteProfilContext'

export type ProfileCompletionAccessOptions = {
  redirectTo?: Href
  /** Appelé après validation du profil si `redirectTo` est absent. */
  onSuccess?: () => void
}

/**
 * Point d’entrée unique pour le guard profil (boutons, modales, navigation).
 * Les pages protégées utilisent `RequireCompleteProfileGate` + `AccesRestreintProfil` (auto-open au mount + bouton).
 */
export const useProfileCompletionAccess = () => {
  const { isComplete, isLoading } = useProfileCompletion()
  const { openCompleteProfil } = useCompleteProfil()
  const { isAuth, redirectToSignup } = useRequireAuth()

  const requestProfileCompletion = useCallback(
    (options?: ProfileCompletionAccessOptions) => {
      if (!isAuth) {
        redirectToSignup()
        return
      }

      openCompleteProfil(options)
    },
    [isAuth, openCompleteProfil, redirectToSignup],
  )

  const runWithCompleteProfile = useCallback(
    (action: () => void, options?: ProfileCompletionAccessOptions) => {
      if (!isAuth) {
        redirectToSignup()
        return
      }

      if (isLoading) {
        return
      }

      if (!isComplete) {
        requestProfileCompletion({
          redirectTo: options?.redirectTo,
          onSuccess: options?.onSuccess ?? action,
        })
        return
      }

      action()
    },
    [isAuth, isComplete, isLoading, redirectToSignup, requestProfileCompletion],
  )

  return { isComplete, isLoading, runWithCompleteProfile, requestProfileCompletion }
}
