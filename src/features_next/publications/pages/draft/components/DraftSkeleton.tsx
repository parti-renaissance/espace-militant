import React from 'react'
import { YStack, getToken } from "tamagui";
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { ContentBackButton } from '@/components/ContentBackButton';
import Layout from '@/components/AppStructure/Layout/Layout';
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView';

export function DraftSkeleton() {
  return (
    <Layout.Main>
      <LayoutScrollView padding="left">
        <YStack gap={getToken('$medium', 'space')}>
          <ContentBackButton fallbackPath="/(militant)/publications" />
          {Array.from({ length: 3 }).map((_, i) => (
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

