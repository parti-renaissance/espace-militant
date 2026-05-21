import React from 'react'
import { Link, useNavigation } from 'expo-router'
import { isWeb, useMedia, XStack, YStack } from 'tamagui'
import { Info, Zap } from '@tamagui/lucide-icons'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import { SF } from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'

const DesktopSkeleton = (props?: { editMode?: boolean }) => (
  <Layout.Main maxWidth={892}>
    <LayoutScrollView>
      <XStack paddingBottom="$medium" flex={1}>
        <SkeCard.Button size="md" />
      </XStack>
      <YStack gap="$medium">
        <SkeCard>
          <VoxCard.Content paddingBottom={0} justifyContent="center" alignItems="center">
            <VoxHeader.Title icon={Zap}>{`${props?.editMode ? 'Modifier' : 'Créer'} l’action`}</VoxHeader.Title>
          </VoxCard.Content>
          {props?.editMode ? null : (
            <VoxCard.Content paddingBottom={0} paddingTop={0}>
              <MessageCard theme="gray" iconLeft={Info}>
                Organisez une <Text.MD bold>action militante sur le terrain</Text.MD> pour mobiliser vos militants autour de vous.
              </MessageCard>
            </VoxCard.Content>
          )}
          <XStack paddingVertical="$medium">
            <YStack flex={1} paddingHorizontal="$medium" gap="$medium">
              <SF height={200} />
            </YStack>
            <YStack maxWidth={400} paddingHorizontal="$medium" gap="$medium">
              <SF height={120} />
              <SF height={80} />
              <SF />
            </YStack>
          </XStack>
          <SkeCard.Content>
            <XStack justifyContent="flex-end">
              <SkeCard.Button theme="green" />
            </XStack>
          </SkeCard.Content>
        </SkeCard>
      </YStack>
    </LayoutScrollView>
  </Layout.Main>
)

const MobileSkeleton = (props?: { editMode?: boolean }) => {
  const navigation = useNavigation()

  return (
    <YStack flex={1}>
      <VoxHeader>
        <XStack alignItems="center" flex={1} width="100%">
          <XStack alignContent="flex-start">
            <Link href={navigation.canGoBack() ? '../' : '/evenements/list?itemType=action'} replace asChild={!isWeb}>
              <VoxButton size="lg" variant="soft" theme="orange">
                Annuler
              </VoxButton>
            </Link>
          </XStack>
          <XStack flexGrow={1} justifyContent="center">
            <VoxHeader.Title>{`${props?.editMode ? 'Modifier' : 'Créer'} l’action`}</VoxHeader.Title>
          </XStack>
          <SkeCard.Button size="md" theme="green" />
        </XStack>
      </VoxHeader>
      <LayoutScrollView padding={false}>
        <SkeCard borderWidth={0}>
          {props?.editMode ? null : (
            <MessageCard theme="gray" iconLeft={Info}>
              Organisez une <Text.MD bold>action militante sur le terrain</Text.MD> pour mobiliser vos militants autour de vous.
            </MessageCard>
          )}
          <SkeCard.Content>
            <SF height={120} />
            <SkeCard.Separator />
            <SF height={80} />
            <SkeCard.Separator />
            <SF />
            <SkeCard.Separator />
            <SF height={150} />
          </SkeCard.Content>
        </SkeCard>
      </LayoutScrollView>
    </YStack>
  )
}

export function ActionFormScreenSkeleton(props?: { editMode?: boolean }) {
  const media = useMedia()
  return media.sm ? <MobileSkeleton editMode={props?.editMode} /> : <DesktopSkeleton editMode={props?.editMode} />
}
