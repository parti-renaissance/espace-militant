import React from 'react'
import { useMedia, YStack } from 'tamagui'

import SkeCard from '@/components/Skeleton/CardSkeleton'
import { MilitantListHeader } from '@/features_next/militants/components/MilitantListHeader'

import { PAGE_SIZE } from '../constants'

export function MilitantItemSkeleton() {
  return (
    <SkeCard>
      <SkeCard.Content minHeight={122} justifyContent="center">
        <YStack gap="$small">
          <SkeCard.Author />
          <SkeCard.Title />
        </YStack>
      </SkeCard.Content>
    </SkeCard>
  )
}

export function ListSkeleton({ showHeader = true }: { showHeader?: boolean }) {
  const media = useMedia()

  return (
    <YStack gap="$small" paddingHorizontal={media.sm ? 0 : undefined}>
      {showHeader && (
        <MilitantListHeader
          paginationDisabled
          page={1}
          pageSize={PAGE_SIZE}
          onFilterPress={() => {}}
          onRemoveFilter={() => {}}
          onResetAllFilters={() => {}}
          onPageChange={() => {}}
        />
      )}
      <MilitantItemSkeleton />
      <MilitantItemSkeleton />
      <MilitantItemSkeleton />
      <MilitantItemSkeleton />
      <MilitantItemSkeleton />
      <MilitantItemSkeleton />
      <MilitantItemSkeleton />
    </YStack>
  )
}

export default ListSkeleton
