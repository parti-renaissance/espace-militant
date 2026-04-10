import React from 'react'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { XStack } from 'tamagui'
import { X } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'

interface FicheMilitantHeaderProps {
  onClose: () => void
}

export function FicheMilitantHeader({ onClose }: FicheMilitantHeaderProps) {
  const insets = useSafeAreaInsets()

  return (
    <LinearGradient
      colors={insets.top > 10 ? ['#1B2533', '#1B2533BB', '#1B253399', '#1B253300'] : ['#1B2533', '#1B253300']}
      start={[1, 0]}
      end={[1, 1]}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100, zIndex: 1000 }}
    >
      <XStack paddingHorizontal="$medium" paddingVertical="$medium" marginTop={insets.top} alignItems="center" justifyContent="space-between">
        <Text.LG semibold color="white">
          Fiche militant
        </Text.LG>
        <Pressable onPress={onClose} hitSlop={12} role="button" accessibilityLabel="Fermer">
          <X size={24} color="white" />
        </Pressable>
      </XStack>
    </LinearGradient>
  )
}
