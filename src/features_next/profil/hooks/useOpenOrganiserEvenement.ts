import { useCallback } from 'react'
import { useRouter } from 'expo-router'

import { CREER_ACTION_HREF, CREER_EVENEMENT_HREF } from '@/features_next/profil/profileCompletion'

import { useProfileCompletionAccess } from './useProfileCompletionAccess'

export { CREER_ACTION_HREF, CREER_EVENEMENT_HREF } from '@/features_next/profil/profileCompletion'

type OpenOrganiserOptions = {
  /** Ex. ouvrir la modale de choix action / événement une fois le profil complété. */
  onComplete?: () => void
}

export const useOpenOrganiserEvenement = () => {
  const router = useRouter()
  const { runWithCompleteProfile } = useProfileCompletionAccess()

  const openOrganiserModal = useCallback(
    (openModal: () => void) => {
      runWithCompleteProfile(openModal)
    },
    [runWithCompleteProfile],
  )

  const openCreateEvent = useCallback(() => {
    runWithCompleteProfile(() => router.push(CREER_EVENEMENT_HREF), { redirectTo: CREER_EVENEMENT_HREF })
  }, [runWithCompleteProfile, router])

  const openCreateAction = useCallback(() => {
    runWithCompleteProfile(() => router.push(CREER_ACTION_HREF), { redirectTo: CREER_ACTION_HREF })
  }, [runWithCompleteProfile, router])

  const openOrganiserEvenement = useCallback(
    (options?: OpenOrganiserOptions) => {
      if (options?.onComplete) {
        openOrganiserModal(options.onComplete)
        return
      }

      openCreateEvent()
    },
    [openOrganiserModal, openCreateEvent],
  )

  return { openOrganiserEvenement, openOrganiserModal, openCreateEvent, openCreateAction }
}
