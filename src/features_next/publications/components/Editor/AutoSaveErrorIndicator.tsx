import { useEffect, useState } from 'react'
import { XStack } from 'tamagui'
import { AlertCircle } from '@tamagui/lucide-icons'

import Chip from '@/components/Chip/Chip'

type AutoSaveErrorIndicatorProps = {
  hasError: boolean
}

export const AutoSaveErrorIndicator = ({ hasError }: AutoSaveErrorIndicatorProps) => {
  const [showError, setShowError] = useState(false)

  // All state updates in effect only — no setState during render (avoids cascading re-renders and JS thread lag)
  useEffect(() => {
    if (hasError) {
      setShowError(true)
      const timer = setTimeout(() => setShowError(false), 6000)
      return () => clearTimeout(timer)
    }
    setShowError(false)
  }, [hasError])

  if (!showError) {
    return null
  }

  return (
    <XStack alignItems="center" gap="$small">
      <Chip children="Erreur de sauvegarde" icon={AlertCircle} alert={true} />
    </XStack>
  )
}
