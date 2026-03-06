import React from 'react'
import { useMedia, YStack } from 'tamagui'

import SkeCard from '@/components/Skeleton/CardSkeleton'
import { MilitantListHeader } from '@/features_next/militants/components/MilitantListHeader'

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

export function ListSkeleton() {
  const media = useMedia()

  return (
    <YStack gap="$medium" paddingHorizontal={media.sm ? 0 : undefined}>
      <MilitantListHeader />
      <MilitantItemSkeleton />
      <MilitantItemSkeleton />
      <MilitantItemSkeleton />
      <MilitantItemSkeleton />
    </YStack>
  )
}

export default ListSkeleton
