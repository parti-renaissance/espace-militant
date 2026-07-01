import React from 'react'
import { useMedia, XStack, YStack } from 'tamagui'
import { ChevronLeft, ChevronRight, CircleX, EqualNot, Filter, RotateCcw, Search } from '@tamagui/lucide-icons'

import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import type { ActiveFilterChip } from '@/components/Filters'

function ActiveFilterChipsRow({
  chips,
  onRemoveFilter,
  onResetAllFilters,
}: {
  chips: ActiveFilterChip[]
  onRemoveFilter: (key: string) => void
  onResetAllFilters: () => void
}) {
  if (chips.length === 0) return null
  return (
    <XStack flexWrap="wrap" alignItems="center" gap="$small">
      {chips.map((chip) => (
        <VoxButton
          key={chip.key}
          size="xxs"
          theme={chip.isNegation ? 'orange' : 'blue'}
          variant="contained"
          iconLeft={chip.isNegation ? EqualNot : undefined}
          iconRight={CircleX}
          onPress={() => onRemoveFilter(chip.key)}
          testID={`filter-chip-${chip.key}`}
        >
          {chip.label} : {chip.value_label}
        </VoxButton>
      ))}
      {chips.length >= 2 ? (
        <VoxButton size="xxs" theme="gray" variant="outlined" iconLeft={RotateCcw} onPress={onResetAllFilters} testID="filter-reset-all">
          Réinitialiser tous les filtres
        </VoxButton>
      ) : null}
    </XStack>
  )
}

interface MilitantHeaderPaginationProps {
  page: number
  pageSize: number
  totalItems?: number
  onPageChange: (page: number) => void
  disabled?: boolean
  rightSlot?: React.ReactNode
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
  searchValue?: string
  onSearchChange?: (value: string) => void
  paginationRightSlot?: React.ReactNode
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

export function MilitantHeaderPagination({ page, pageSize, totalItems, onPageChange, disabled = false, rightSlot }: MilitantHeaderPaginationProps) {
  const media = useMedia()
  const lastPage = totalItems != null ? Math.ceil(totalItems / pageSize) : undefined
  const isPrevDisabled = disabled || page <= 1
  const isNextDisabled = disabled || lastPage == null || page >= lastPage
  const pageStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const pageEnd = totalItems === 0 ? 0 : totalItems != null ? Math.min(page * pageSize, totalItems) : page * pageSize
  const rangeText = `${pageStart}-${pageEnd}`

  return (
    <XStack justifyContent={media.sm ? 'space-between' : 'flex-end'} alignItems="center" gap={rightSlot ? 0 : '$medium'}>
      <Text>
        <Text.SM secondary>{rangeText} sur </Text.SM>
        <Text.MD semibold>{totalItems ?? '–'}</Text.MD>
      </Text>
      {rightSlot ? (
        <YStack px="$small" ml="auto">
          {rightSlot}
        </YStack>
      ) : null}
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
  searchValue = '',
  onSearchChange,
  paginationRightSlot,
}: MilitantListHeaderProps) {
  const media = useMedia()
  const hasActiveFilters = activeFilterChips.length > 0
  const filterChipsRow = <ActiveFilterChipsRow chips={activeFilterChips} onRemoveFilter={onRemoveFilter} onResetAllFilters={onResetAllFilters} />

  if (media.sm) {
    return (
      <YStack gap="$medium" marginBottom="$small">
        <MilitantHeaderTop />
        <YStack gap="$small" mt="$medium" mx="$medium">
          <XStack flex={1} gap="$small" alignItems="center">
            <YStack flex={1}>
              <Input
                placeholder="Rechercher un nom, email..."
                size="xs"
                value={searchValue}
                onChange={onSearchChange}
                iconRight={<Search size={20} color="$textSecondary" />}
              />
            </YStack>
            <YStack>
              <VoxButton variant="outlined" theme={hasActiveFilters ? 'blue' : 'gray'} size="md" iconLeft={Filter} onPress={onFilterPress}>
                Filtrer
              </VoxButton>
            </YStack>
          </XStack>
          {filterChipsRow}
          <MilitantHeaderPagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            disabled={paginationDisabled}
            rightSlot={paginationRightSlot}
          />
        </YStack>
      </YStack>
    )
  }

  return (
    <YStack gap="$medium" marginBottom="$small">
      <MilitantHeaderTop />
      <XStack justifyContent="space-between" alignItems="center" gap="$medium">
        <XStack flex={1} gap="$small" alignItems="center">
          <YStack flex={1} maxWidth={320}>
            <Input
              placeholder="Rechercher un nom, email..."
              size="xs"
              value={searchValue}
              onChange={onSearchChange}
              iconRight={<Search size={20} color="$textSecondary" />}
            />
          </YStack>
          <YStack>
            <VoxButton variant="outlined" theme={hasActiveFilters ? 'blue' : 'gray'} size="md" iconLeft={Filter} onPress={onFilterPress}>
              Filtrer
            </VoxButton>
          </YStack>
        </XStack>
        <MilitantHeaderPagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          disabled={paginationDisabled}
          rightSlot={paginationRightSlot}
        />
      </XStack>
      {filterChipsRow}
    </YStack>
  )
}
