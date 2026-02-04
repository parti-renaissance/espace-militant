import React from 'react'
import { ScrollView, useMedia, YStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import SkeCard from '@/components/Skeleton/CardSkeleton'

const ItemFeedSkeleton = () => (
  <SkeCard>
    <SkeCard.Content>
      <SkeCard.Chip />
      <SkeCard.Author />
      <SkeCard.Title />
      <SkeCard.Image />
      <SkeCard.Actions />
    </SkeCard.Content>
  </SkeCard>
)

export const HomeFeedMainSkeleton: React.FC = () => {
  const media = useMedia()

  return (
    <Layout.Main>
      <LayoutScrollView>
        <YStack gap="$medium">
          <ItemFeedSkeleton />
          <ItemFeedSkeleton />
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}

export const HomeFeedSidebarSkeleton: React.FC = () => {
  const media = useMedia()

  if (!media.gtMd) {
    return null
  }

  return (
    <ScrollView contentContainerStyle={{ height: '100dvh' }}>
      <YStack alignItems="center" justifyContent="center" gap="$medium">
        <SkeCard height={275} width="100%">
          <SkeCard.Content>
            <SkeCard.Author />
            <SkeCard.Title />
            <SkeCard.Description />
          </SkeCard.Content>
        </SkeCard>
        <SkeCard height={275} width="100%">
          <SkeCard.Content>
            <SkeCard.Image />
            <SkeCard.Title />
          </SkeCard.Content>
        </SkeCard>
      </YStack>
    </ScrollView>
  )
}
