import React from 'react'
import { YStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import SkeCard from '@/components/Skeleton/CardSkeleton'

export function IndexSkeleton() {
  return (
    <Layout.Main>
      <LayoutScrollView>
        <YStack gap="$xlarge" width="100%" marginHorizontal="auto" paddingBottom={100}>
          <SkeCard>
            <SkeCard.Content>
              <SkeCard.Description />
            </SkeCard.Content>
          </SkeCard>
          <SkeCard>
            <SkeCard.Content>
              <SkeCard.Title />
              <SkeCard.Description />
            </SkeCard.Content>
          </SkeCard>
          <SkeCard>
            <SkeCard.Content>
              <SkeCard.Title />
              <SkeCard.Description />
            </SkeCard.Content>
          </SkeCard>
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}
