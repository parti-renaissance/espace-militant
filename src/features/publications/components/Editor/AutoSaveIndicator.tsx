import React, { useEffect, useState } from 'react'
import { YStack } from 'tamagui'
import Chip from '@/components/Chip/Chip'
import { Save, CheckCircle, AlertCircle, Clock } from '@tamagui/lucide-icons'

type AutoSaveIndicatorProps = {
  isSaving: boolean
  lastSaved?: Date
  hasError?: boolean
}

export const AutoSaveIndicator = ({ 
  isSaving, 
  lastSaved, 
  hasError, 
}: AutoSaveIndicatorProps) => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true)
      return
    }

    if (isSaving) {
      setShowSuccess(false)
      return
    }

    if (hasError) {
      setShowSuccess(false)
      return
    }

    if (lastSaved) {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [isSaving, hasError, lastSaved, hasInitialized])

  if (!hasInitialized || (!isSaving && !hasError && !showSuccess)) {
    return null
  }

  let chipProps: {
    children: string
    icon?: typeof Save | typeof CheckCircle | typeof AlertCircle | typeof Clock
    theme?: 'gray' | 'blue' | 'green' | 'orange' | 'red'
    alert?: boolean
  }

  if (isSaving) {
    chipProps = {
      children: 'Sauvegarde...',
      icon: Save,
      theme: 'blue'
    }
  } else if (hasError) {
    chipProps = {
      children: 'Erreur de sauvegarde',
      icon: AlertCircle,
      alert: true
    }
  } else {
    chipProps = {
      children: 'Sauvegardé',
      icon: CheckCircle,
      theme: 'green'
    }
  }

  return (
    <YStack
      position="fixed"
      bottom={20}
      right={20}
      zIndex={1000}
      userSelect="none"
    >
      <Chip {...chipProps} />
    </YStack>
  )
} 