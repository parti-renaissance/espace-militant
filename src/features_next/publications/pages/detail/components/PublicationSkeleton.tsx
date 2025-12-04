import React from 'react'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { useMedia, YStack } from 'tamagui'
import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'

export function PublicationSkeleton() {
  return (
    <Layout.Main>
      <LayoutScrollView>
        <YStack gap="$medium" width="100%" marginHorizontal="auto" paddingBottom={100}>
          <SkeCard>
            <SkeCard.Content>
              <SkeCard.Chip />
              <SkeCard.Author />
              <SkeCard.Title />
              <SkeCard.Separator />
              <SkeCard.Description />
              <SkeCard.Image />
              <SkeCard.Description />
            </SkeCard.Content>
          </SkeCard>
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}

