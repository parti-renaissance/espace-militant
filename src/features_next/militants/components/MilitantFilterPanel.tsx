import React from 'react'
import { Pressable } from 'react-native'
import { XStack, YStack } from 'tamagui'
import { X } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import FilterCollectionBuilder from '@/components/Filters/FilterCollectionBuilder'
import type { FilterValues } from '@/components/Filters/FilterCollectionBuilder'

interface MilitantFilterPanelProps {
  scope?: string
  initialValues?: FilterValues
  onChangeFilter: (values: FilterValues) => void
  onClose?: () => void
}

export function MilitantFilterPanel({ scope, initialValues, onChangeFilter, onClose }: MilitantFilterPanelProps) {
  return (
    <YStack flex={1} mb={350}>
      <XStack paddingHorizontal="$medium" paddingVertical="$small" alignItems="center" justifyContent="space-between">
        <Text.LG semibold>Tous les filtres</Text.LG>
        {onClose && (
          <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Fermer">
            <X size={24} color="$textPrimary" />
          </Pressable>
        )}
      </XStack>
      <YStack padding="$medium" paddingTop="$small" gap="$medium" flex={1}>
        <FilterCollectionBuilder featureKey="publications" scope={scope} initialValues={initialValues} onChangeFilter={onChangeFilter} />
      </YStack>
    </YStack>
  )
}
