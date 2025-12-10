import React from 'react'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { XStack, YStack, useMedia } from 'tamagui'
import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'

const MobileSkeleton = () => {
  return (
    <LayoutScrollView padding={false}>
      <YStack>
        <SkeCard.Image />
        <SkeCard>
          <SkeCard.Content>
            <XStack justifyContent="space-between" alignItems="center">
              <SkeCard.Chip />
              <SkeCard.Chip />
            </XStack>
            <SkeCard.Title />
            <SkeCard.Description />
            <SkeCard.Separator />
            <SkeCard.Date />
            <SkeCard.Date />
            <SkeCard.Date />
            <SkeCard.Section>
              <SkeCard.Author />
            </SkeCard.Section>
            <SkeCard.Section>
              <SkeCard.Button full size="xl" />
              <SkeCard.Button full size="xl" />
            </SkeCard.Section>
          </SkeCard.Content>
        </SkeCard>
      </YStack>
    </LayoutScrollView>
  )
}

const DesktopSkeleton = () => {
  return (
    <Layout.Main maxWidth={892}>
      <LayoutScrollView>
        <XStack alignItems="flex-start" alignSelf="flex-start" pb="$medium">
          <SkeCard.Button />
        </XStack>
        <YStack gap="$medium">
          <SkeCard>
            <XStack alignItems="flex-start" py="$medium">
              <YStack flex={1} flexShrink={1} gap="$medium" px="$medium" borderRightColor="$textOutline32" borderRightWidth={1}>
                <SkeCard.Image />
                <XStack justifyContent="space-between" alignItems="center">
                  <SkeCard.Chip />
                  <SkeCard.Chip />
                </XStack>
                <SkeCard.Title />
                <SkeCard.Description />
              </YStack>
              <YStack width={320} px="$medium" gap="$medium">
                <SkeCard.Button full size="xl" />
                <SkeCard.Separator />
                <SkeCard.Date />
                <SkeCard.Date />
                <SkeCard.Section>
                  <SkeCard.Author />
                </SkeCard.Section>
              </YStack>
            </XStack>
          </SkeCard>
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}

export function EventSkeleton() {
  const media = useMedia()
  return media.sm ? <MobileSkeleton /> : <DesktopSkeleton />
}

