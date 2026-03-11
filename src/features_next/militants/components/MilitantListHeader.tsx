import React from 'react'
import { useMedia, View, XStack, YStack } from 'tamagui'
import { ChevronLeft, ChevronRight, CircleX, Filter, RotateCcw } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import type { ActiveFilterChip } from '@/components/Filters'

interface MilitantHeaderPaginationProps {
  page: number
  pageSize: number
  totalItems?: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export interface MilitantListHeaderProps {
  onFilterPress: () => void
  activeFilterChips?: ActiveFilterChip[]
  onRemoveFilter: (filterKey: string) => void
  onResetAllFilters: () => void
  paginationDisabled?: boolean
  page: number
  pageSize: number
  totalItems?: number
  onPageChange: (page: number) => void
}

export function MilitantHeaderTop() {
  const media = useMedia()

  if (media.sm) {
    return null
  }

  return (
    <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$medium">
      <YStack flex={1} gap="$small">
        <Text.LG semibold>Mes militants</Text.LG>
        <Text.SM secondary>Consultez et gérez les militants de votre périmètre</Text.SM>
      </YStack>
    </XStack>
  )
}

function MilitantHeaderPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  disabled = false,
}: MilitantHeaderPaginationProps) {
  const media = useMedia()
  const lastPage = totalItems != null ? Math.ceil(totalItems / pageSize) : undefined
  const isPrevDisabled = disabled || page <= 1
  const isNextDisabled = disabled || (lastPage == null || page >= lastPage)
  const pageStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const pageEnd = totalItems === 0 ? 0 : totalItems != null ? Math.min(page * pageSize, totalItems) : page * pageSize
  const rangeText = `${pageStart}-${pageEnd}`

  return (
    <XStack justifyContent={media.sm ? 'space-between' : 'flex-end'} alignItems="center" gap="$medium">
      <Text.SM>
        <Text.SM secondary>{rangeText} sur </Text.SM>
        <Text.SM semibold>{totalItems ?? '–'}</Text.SM>
      </Text.SM>
      <XStack gap={4}>
        <VoxButton
          variant="outlined"
          theme="gray"
          size="md"
          shrink
          iconLeft={ChevronLeft}
          onPress={() => onPageChange(page - 1)}
          disabled={isPrevDisabled}
          opacity={isPrevDisabled ? 0.5 : 1}
        >
          Précédent
        </VoxButton>
        <VoxButton
          variant="outlined"
          theme="gray"
          size="md"
          shrink
          iconRight={ChevronRight}
          onPress={() => onPageChange(page + 1)}
          disabled={isNextDisabled}
          opacity={isNextDisabled ? 0.5 : 1}
        >
          Suivant
        </VoxButton>
      </XStack>
    </XStack>
  )
}

export function MilitantListHeader({
  onFilterPress,
  activeFilterChips = [],
  onRemoveFilter,
  onResetAllFilters,
  paginationDisabled = false,
  page,
  pageSize,
  totalItems,
  onPageChange,
}: MilitantListHeaderProps) {
  const media = useMedia()
  const hasActiveFilters = activeFilterChips.length > 0

  return (
    <YStack gap="$small">
      <MilitantHeaderTop />
      <View flexDirection={media.sm ? 'column' : 'row'} justifyContent="space-between" gap="$small" mt="$medium" mx={media.sm ? '$medium' : undefined}>
        <VoxButton variant="outlined" theme={hasActiveFilters ? 'blue' : 'gray'} size="md" iconLeft={Filter} onPress={onFilterPress}>
          Filtrer
        </VoxButton>

        <MilitantHeaderPagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          disabled={paginationDisabled}
        />
      </View>
      {activeFilterChips.length > 0 ? (
        <XStack flexWrap="wrap" alignItems="center" gap="$small" mx={media.sm ? '$medium' : undefined}>
          {activeFilterChips.map((chip) => (
            <VoxButton
              key={chip.key}
              size="xxs"
              theme="blue"
              variant="contained"
              iconRight={CircleX}
              onPress={() => onRemoveFilter(chip.key)}
              testID={`filter-chip-${chip.key}`}
            >
              {chip.label} : {chip.value_label}
            </VoxButton>
          ))}
          {activeFilterChips.length >= 2 ? (
            <VoxButton size="xxs" theme="gray" variant="outlined" iconLeft={RotateCcw} onPress={onResetAllFilters} testID="filter-reset-all">
              Réinitialiser tous les filtres
            </VoxButton>
          ) : null}
        </XStack>
      ) : null}
    </YStack>
  )
}
