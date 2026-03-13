import React from 'react'
import { Pressable } from 'react-native'
import { XStack, YStack } from 'tamagui'
import { X } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'

interface FicheMilitantHeaderProps {
  onClose: () => void
}

export function FicheMilitantHeader({ onClose }: FicheMilitantHeaderProps) {
  return (
    <XStack paddingHorizontal="$medium" paddingVertical="$small" alignItems="center" justifyContent="space-between">
      <Text.LG semibold>Fiche militant</Text.LG>
      <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Fermer">
        <X size={24} color="$textPrimary" />
      </Pressable>
    </XStack>
  )
}
