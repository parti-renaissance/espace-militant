import React from 'react'
import { VoxHeader } from '@/components/Header/Header'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { SF } from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { Calendar, Info } from '@tamagui/lucide-icons'
import { Link, useNavigation } from 'expo-router'
import { isWeb, XStack, YStack } from 'tamagui'
import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'

const DesktopSkeleton = (props?: { editMode?: boolean }) => {
  return (
    <Layout.Main maxWidth={920}>
      <LayoutScrollView>
        <XStack paddingBottom="$medium" flex={1}>
          <SkeCard.Button />
        </XStack>
        <YStack gap="$medium">
          <SkeCard>
            <VoxCard.Content paddingBottom={0} justifyContent="center" alignItems="center">
              <VoxHeader.Title icon={Calendar}>{`${props?.editMode ? 'Modifier' : 'Créer'} l'événement`}</VoxHeader.Title>
            </VoxCard.Content>
            <VoxCard.Content paddingBottom={0} paddingTop={0}>
              {props?.editMode ? null : (
                <MessageCard theme="gray" iconLeft={Info}>
                  Créez un événement pour faire <Text.MD bold>campagne, rassembler vos militants ou récompenser vos adhérents.</Text.MD>
                </MessageCard>
              )}
            </VoxCard.Content>
            <SkeCard.Content>
              <SF height={300} />
              <SkeCard.Separator />
              <SF />
              <SF height={200} />
            </SkeCard.Content>
            <SkeCard.Content>
              <SF theme="purple" />
              <SkeCard.Separator />
              <SF />
              <SF />
              <SF height={200} />
              <XStack gap="$small">
                <SkeCard.Button />
                <SkeCard.Button />
              </XStack>
              <SF />
              <SkeCard.Separator />
              <SF />
              <SF />
              <XStack alignItems="center" justifyContent="flex-end" gap="$small" flex={1} width="100%">
                <XStack>
                  <SkeCard.Button theme="purple" />
                </XStack>
              </XStack>
            </SkeCard.Content>
          </SkeCard>
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}

const MobileSkeleton = (props?: { editMode?: boolean }) => {
  const navigation = useNavigation()

  return (
    <LayoutScrollView padding={false}>
      <YStack>
        <VoxHeader>
          <XStack alignItems="center" flex={1} width="100%">
            <XStack alignContent="flex-start">
              <Link href={navigation.canGoBack() ? '../' : '/(militant)/evenements'} replace asChild={!isWeb}>
                <VoxButton size="lg" variant="soft" theme="orange">
                  Annuler
                </VoxButton>
              </Link>
            </XStack>
            <XStack flexGrow={1} justifyContent="center">
              <VoxHeader.Title>{props?.editMode ? "Modifier l'événement" : 'Créer un événement'}</VoxHeader.Title>
            </XStack>
            <XStack>
              <VoxButton size="lg" variant="text" theme="blue" disabled>
                Créer
              </VoxButton>
            </XStack>
          </XStack>
        </VoxHeader>

        <SkeCard>
          <SkeCard.Content>
            <SF theme="purple" />
            <SkeCard.Separator />
            <SF />
            <SF />
            <SF />
            <SkeCard.Separator />
            <SF height={200} />
            <SkeCard.Separator />
            <XStack gap="$small">
              <SkeCard.Button />
              <SkeCard.Button />
            </XStack>
            <SF />
            <SF height={200} />
            <SkeCard.Separator />
            <SF />
            <SF />
          </SkeCard.Content>
        </SkeCard>
      </YStack>
    </LayoutScrollView>
  )
}

export const EventFormDesktopScreenSkeleton = (props?: { editMode?: boolean }) => {
  return <DesktopSkeleton editMode={props?.editMode} />
}

export const EventFormMobileScreenSkeleton = (props?: { editMode?: boolean }) => {
  return <MobileSkeleton editMode={props?.editMode} />
}

