import { useMedia, XStack, YStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import SkeCard from '@/components/Skeleton/CardSkeleton'

const MapPlaceholder = () => <YStack height={240} width="100%" backgroundColor="$gray1" />

const MobileSkeleton = () => (
  <Layout.Main maxWidth={892}>
    <LayoutScrollView padding={false}>
      <YStack>
        <MapPlaceholder />
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
            <SkeCard.Section>
              <SkeCard.Author />
            </SkeCard.Section>
            <SkeCard.Separator />
            <SkeCard.Description />
            <XStack flexWrap="wrap" gap="$medium">
              <SkeCard.Author />
              <SkeCard.Author />
              <SkeCard.Author />
            </XStack>
            <SkeCard.Button full size="xl" />
            <SkeCard.Button full size="xl" />
          </SkeCard.Content>
        </SkeCard>
      </YStack>
    </LayoutScrollView>
  </Layout.Main>
)

const DesktopSkeleton = () => (
  <Layout.Main maxWidth={892}>
    <LayoutScrollView>
      <XStack alignItems="flex-start" alignSelf="flex-start" pb="$medium">
        <SkeCard.Button />
      </XStack>
      <YStack gap="$medium">
        <SkeCard>
          <XStack alignItems="flex-start" py="$medium">
            <YStack flex={1} flexShrink={1} gap="$medium" px="$medium" borderRightColor="$textOutline32" borderRightWidth={1}>
              <YStack height={300} width="100%" backgroundColor="$gray1" />
              <XStack justifyContent="space-between" alignItems="center">
                <SkeCard.Chip />
                <SkeCard.Chip />
              </XStack>
              <SkeCard.Title />
              <SkeCard.Description />
              <SkeCard.Separator />
              <XStack flexWrap="wrap" gap="$medium">
                <SkeCard.Author />
                <SkeCard.Author />
                <SkeCard.Author />
              </XStack>
            </YStack>
            <YStack width={320} px="$medium" gap="$medium">
              <SkeCard.Button full size="xl" />
              <SkeCard.Separator />
              <SkeCard.Date />
              <SkeCard.Section>
                <SkeCard.Author />
              </SkeCard.Section>
              <SkeCard.Button full size="xl" />
              <SkeCard.Button full size="xl" />
            </YStack>
          </XStack>
        </SkeCard>
      </YStack>
    </LayoutScrollView>
  </Layout.Main>
)

export function ActionDescriptionSkeleton() {
  return <SkeCard.Description />
}

export function ActionParticipantsSkeleton() {
  return (
    <YStack gap="$medium" pb="$medium">
      <SkeCard.Line width={140} />
      <XStack flexWrap="wrap" gap="$medium" justifyContent="flex-start">
        <SkeCard.Author />
        <SkeCard.Author />
        <SkeCard.Author />
      </XStack>
    </YStack>
  )
}

export function ActionSkeleton() {
  const media = useMedia()
  return media.sm ? <MobileSkeleton /> : <DesktopSkeleton />
}
