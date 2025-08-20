import React, { useEffect, useState } from 'react'
import { XStack } from 'tamagui'
import Chip from '@/components/Chip/Chip'
import { AlertCircle } from '@tamagui/lucide-icons'

type AutoSaveErrorIndicatorProps = {
  hasError: boolean
}

export const AutoSaveErrorIndicator = ({ 
  hasError
}: AutoSaveErrorIndicatorProps) => {
  const [showError, setShowError] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true)
      return
    }

    if (hasError) {
      setShowError(true)
      // L'erreur disparaît automatiquement après 6 secondes
      const timer = setTimeout(() => setShowError(false), 6000)
      return () => clearTimeout(timer)
    } else {
      setShowError(false)
    }
  }, [hasError, hasInitialized])

  if (!hasInitialized || !showError) {
    return null
  }

  return (
    <XStack alignItems="center" gap="$small">
      <Chip
        children="Erreur de sauvegarde"
        icon={AlertCircle}
        alert={true}
      />
    </XStack>
  )
} 