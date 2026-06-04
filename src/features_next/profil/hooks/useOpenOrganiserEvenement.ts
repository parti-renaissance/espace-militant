import { useCallback } from 'react'
import { useRouter } from 'expo-router'

import { useSession } from '@/ctx/SessionProvider'
import { CREER_ACTION_HREF, CREER_EVENEMENT_HREF } from '@/features_next/profil/profileCompletion'
import { useUserScopeFeatures } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

import { useProfileCompletionAccess } from './useProfileCompletionAccess'

export { CREER_ACTION_HREF, CREER_EVENEMENT_HREF } from '@/features_next/profil/profileCompletion'

type OpenOrganiserOptions = {
  /** Ex. ouvrir la modale de choix action / événement une fois le profil complété. */
  onComplete?: () => void
}

export const useOpenOrganiserEvenement = () => {
  const router = useRouter()
  const { runWithCompleteProfile } = useProfileCompletionAccess()
  const { isAuth } = useSession()
  const { hasFeature } = useUserScopeFeatures({ enabled: isAuth })

  const openOrganiserModal = useCallback(
    (openModal: () => void) => {
      const hasEvents = hasFeature(FEATURES.EVENTS)
      const hasActions = hasFeature(FEATURES.ACTIONS)

      const proceed = () => {
        if (hasEvents && hasActions) {
          openModal()
          return
        }

        if (hasEvents) {
          router.push(CREER_EVENEMENT_HREF)
          return
        }

        if (hasActions) {
          router.push(CREER_ACTION_HREF)
          return
        }

        console.warn('User lacks both EVENTS and ACTIONS features')
      }

      let redirectTo: typeof CREER_EVENEMENT_HREF | typeof CREER_ACTION_HREF | undefined
      if (hasEvents && !hasActions) {
        redirectTo = CREER_EVENEMENT_HREF
      } else if (hasActions && !hasEvents) {
        redirectTo = CREER_ACTION_HREF
      }

      runWithCompleteProfile(proceed, redirectTo ? { redirectTo } : undefined)
    },
    [hasFeature, runWithCompleteProfile, router],
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
