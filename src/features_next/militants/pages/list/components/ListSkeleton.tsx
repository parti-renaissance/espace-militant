import React from 'react'
import { useMedia, YStack } from 'tamagui'

import SkeCard from '@/components/Skeleton/CardSkeleton'
import { MilitantListHeader } from '@/features_next/militants/components/MilitantListHeader'

import { PAGE_SIZE } from '../constants'

export function MilitantItemSkeleton() {
  return (
    <SkeCard>
      <SkeCard.Content>
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
    <YStack gap="$medium" paddingHorizontal={media.sm ? 0 : undefined}>
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
