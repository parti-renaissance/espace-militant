import React from 'react'
import { XStack, YStack } from 'tamagui'
import Text from '@/components/base/Text'
import SelectQuickFiltersItem from './SelectQuickFiltersItem'
import { HierarchicalQuickFilterType } from './type'
import { getItemState } from './helpers'

interface QuickFilterProps {
  quickFilters: HierarchicalQuickFilterType[]
  tempSelectedQuickFilter: string | null
  selectedQuickFilterId: string | null
  onItemSelection: (value: string, hasSelectedQuickFilter: boolean) => void
}

export default function QuickFilter({
  quickFilters,
  tempSelectedQuickFilter,
  selectedQuickFilterId,
  onItemSelection,
}: QuickFilterProps) {
  return (
    <YStack gap="$medium">
      <XStack alignItems="center" gap="$small">
        <Text.MD secondary>Filtres militants</Text.MD>
        <YStack h={1} flexGrow={1} mt={2} bg="$textOutline" />
      </XStack>
      <YStack gap="$small">
        {quickFilters.map((item) => {
          const state = getItemState(item.value, tempSelectedQuickFilter, quickFilters)
          return (
            <SelectQuickFiltersItem
              key={item.value}
              label={item.label}
              count={item.count}
              state={state}
              onPress={() => onItemSelection(item.value, !!selectedQuickFilterId)}
              type={item.type}
            />
          )
        })}
      </YStack>
    </YStack>
  )
}