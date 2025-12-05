import React from 'react'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { useMedia, YStack, ScrollView } from 'tamagui'
import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'

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
        <YStack gap="$medium" paddingHorizontal={media.sm ? "$medium" : undefined}>
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
    <Layout.SideBar isSticky>
      <ScrollView contentContainerStyle={{ height: '100dvh' }}>
        <YStack alignItems="center" justifyContent="center" gap="$medium">
          <SkeCard height={275} width="100%">
            <SkeCard.Content>
              <SkeCard.Author />
              <SkeCard.Title />
              <SkeCard.Description />
            </SkeCard.Content>
          </SkeCard>
        </YStack>
      </ScrollView>
    </Layout.SideBar>
  )
}

