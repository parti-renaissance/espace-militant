import { useCallback, useEffect, useRef } from 'react'
import { Href } from 'expo-router'
import { useMedia, YStack } from 'tamagui'
import { UserRoundPen } from '@tamagui/lucide-icons'

import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import { AccessDeny } from '@/components/AccessDeny'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'

import { useCompleteProfil } from '../context/CompleteProfilContext'

type AccesRestreintProfilProps = {
  redirectTo: Href
}

/**
 * Ouvre le modal une fois par visite d’écran (mount), compatible React 18 Strict Mode :
 * le cleanup invalide le microtask du cycle « fantôme » avant le remount de dev.
 * Si l’utilisateur ferme le modal, l’effet ne se relance pas → pas de boucle.
 */
function useAutoOpenCompletionModal(openCompletionModal: () => void) {
  const hasAutoOpenedRef = useRef(false)

  useEffect(() => {
    if (hasAutoOpenedRef.current) {
      return
    }

    let active = true

    queueMicrotask(() => {
      if (!active || hasAutoOpenedRef.current) {
        return
      }
      hasAutoOpenedRef.current = true
      openCompletionModal()
    })

    return () => {
      active = false
    }
  }, [openCompletionModal])
}

export default function AccesRestreintProfil({ redirectTo }: AccesRestreintProfilProps) {
  const media = useMedia()
  const { openCompleteProfil } = useCompleteProfil()

  const openCompletionModal = useCallback(() => {
    openCompleteProfil({ redirectTo })
  }, [openCompleteProfil, redirectTo])

  useAutoOpenCompletionModal(openCompletionModal)

  return (
    <LayoutScrollView>
      <YStack flex={1} pt={media.sm ? 8 : undefined}>
        <VoxCard>
          <AccessDeny
            message="Complétez votre profil pour accéder à cette page."
            Button={
              <VoxButton iconLeft={UserRoundPen} onPress={openCompletionModal}>
                Compléter mon profil
              </VoxButton>
            }
          />
        </VoxCard>
      </YStack>
    </LayoutScrollView>
  )
}
