import React from 'react'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { XStack } from 'tamagui'
import { X } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'

interface FicheMilitantHeaderProps {
  onClose: () => void
}

export function FicheMilitantHeader({ onClose }: FicheMilitantHeaderProps) {
  const insets = useSafeAreaInsets()

  return (
    <XStack paddingHorizontal="$medium" paddingVertical="$medium" marginTop={insets.top} alignItems="center" justifyContent="space-between">
      <Text.LG semibold>Fiche militant</Text.LG>
      <Pressable onPress={onClose} hitSlop={12} role="button" accessibilityLabel="Fermer">
        <X size={24} color="$textPrimary" />
      </Pressable>
    </XStack>
  )
}
