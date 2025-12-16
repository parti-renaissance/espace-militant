import React from 'react'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { useMedia, XStack, YStack } from 'tamagui'
import { Layout, LayoutScrollView } from '@/components/AppStructure'
import { PublicationsListHeader } from './Header'

const PublicationItemSkeleton = ({ withStats = false }: { withStats?: boolean }) => {
  const media = useMedia()

  return (
    <SkeCard>
      <SkeCard.Content gap={20}>
        <YStack gap="$small">
          <SkeCard.Author />
          <SkeCard.Title />
          <SkeCard.Date />
        </YStack>

        {withStats && (
          <XStack gap="$small" flexWrap="wrap">
            <XStack gap="$small" flexGrow={1} width={media.md ? '100%' : undefined}>
              <SkeCard.Button width={100} height={80} />
              <SkeCard.Button width={100} height={80} />
              <SkeCard.Button width={100} height={80} />
            </XStack>
            <XStack gap="$small" flexGrow={1} width={media.md ? '100%' : undefined}>
              <SkeCard.Button width={100} height={80} />
              <SkeCard.Button width={100} height={80} />
              <SkeCard.Button width={100} height={80} />
            </XStack>
          </XStack>
        )}

        <XStack gap="$small" justifyContent={media.md ? 'space-between' : 'flex-start'}>
          <XStack gap="$small">
            <SkeCard.Button width={100} height={50} />
            {withStats && <SkeCard.Button width={100} height={50} />}
          </XStack>
          {!withStats && (
            <XStack gap="$small">
              <SkeCard.Button width={100} height={50} />
            </XStack>
          )}
        </XStack>
      </SkeCard.Content>
    </SkeCard>
  )
}

export function ListSkeleton() {
  const media = useMedia()

  return (
    <Layout.Main maxWidth={892}>
      <LayoutScrollView contentContainerStyle={{ paddingTop: media.sm ? 0 : undefined }}>
        <YStack gap="$medium" paddingHorizontal={media.sm ? 0 : undefined}>
          {!media.sm && <PublicationsListHeader />}
          <PublicationItemSkeleton />
          <PublicationItemSkeleton withStats={true} />
          <PublicationItemSkeleton />
          <PublicationItemSkeleton withStats={true} />
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}

export default ListSkeleton
