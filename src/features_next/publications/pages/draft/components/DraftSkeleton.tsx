import React from 'react'
import { YStack, getToken } from "tamagui";
import SkeCard from '@/components/Skeleton/CardSkeleton'
import Layout from '@/components/AppStructure/Layout/Layout';
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView';

export function DraftSkeleton() {
  return (
    <Layout.Main>
      <LayoutScrollView padding="left">
        <YStack gap={getToken('$medium', 'space')}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeCard key={i} width="100%" height={195}>
              <SkeCard.Content>
                <SkeCard.Chip />
                <SkeCard.Author />
                <SkeCard.Title />
                <SkeCard.Line width="30%" />
              </SkeCard.Content>
            </SkeCard>
          ))}
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}

