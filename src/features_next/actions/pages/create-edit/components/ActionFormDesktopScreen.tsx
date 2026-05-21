import React from 'react'
import { Link, useNavigation, type Href } from 'expo-router'
import { isWeb, Spinner, XStack, YStack } from 'tamagui'
import { ArrowLeft, Ban, Info, Sparkle, Zap } from '@tamagui/lucide-icons'
import { Controller } from 'react-hook-form'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import VoxCard from '@/components/VoxCard/VoxCard'

import { useActionFormContext } from '../helpers/context'
import ActionAddressField from './ActionAddressField'
import ActionDateField from './ActionDateField'
import ActionTypeField from './ActionTypeField'

const ActionFormMain = () => {
  const { control } = useActionFormContext()

  return (
    <YStack gap="$medium">
      <XStack gap="$medium" alignContent="center" alignItems="center">
        <Text.MD secondary>Catégorie</Text.MD>
        <VoxCard.Separator />
      </XStack>
      <ActionTypeField />
      <VoxCard.Separator />
      <ActionDateField control={control} />
      <ActionAddressField />
    </YStack>
  )
}

const ActionFormAside = () => {
  const { control } = useActionFormContext()

  return (
    <YStack flex={1} gap="$medium" height="100%" minHeight={0}>
      <XStack gap="$medium" alignContent="center" alignItems="center">
        <Text.MD secondary>Optionnel</Text.MD>
        <VoxCard.Separator />
      </XStack>
      <YStack flex={1} minHeight={0} minWidth={0}>
        <Controller
          render={({ field, fieldState }) => (
            <Input
              fill
              size="sm"
              color="gray"
              placeholder="Ajoutez une description"
              multiline
              error={fieldState.error?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
          control={control}
          name="description"
        />
      </YStack>
    </YStack>
  )
}

const ActionFormActions = () => {
  const { isPending, onSubmit, editMode, cancelModalRef } = useActionFormContext()

  return (
    <XStack gap="$medium">
      {editMode ? (
        <VoxButton variant="soft" theme="orange" size="sm" iconLeft={Ban} onPress={() => cancelModalRef.current?.present()}>
          Annuler l’action
        </VoxButton>
      ) : null}
      <YStack ml="auto">
        <VoxButton onPress={onSubmit} size="md" variant="contained" theme="purple" loading={isPending} iconLeft={Sparkle}>
          {isPending ? `${editMode ? 'Modification' : 'Création'}...` : `${editMode ? 'Modifier' : 'Créer'} l’action`}
        </VoxButton>
      </YStack>
    </XStack>
  )
}

const BackButton = (props: { href: Href; children?: React.ReactNode }) => {
  const { canGoBack } = useNavigation()
  return (
    <Link href={canGoBack() ? '../' : props.href} asChild={!isWeb}>
      <VoxButton variant="text" iconLeft={ArrowLeft} borderRadius={16}>
        {props.children ?? 'Annuler'}
      </VoxButton>
    </Link>
  )
}

export default function ActionFormDesktopScreen() {
  const { editMode, isPending, cancelHref } = useActionFormContext()

  return (
    <Layout.Main maxWidth={892}>
      <LayoutScrollView>
        <XStack paddingBottom="$medium" flex={1}>
          <BackButton href={cancelHref} />
        </XStack>
        <YStack gap="$medium">
          <VoxCard opacity={isPending ? 0.5 : 1} style={{ pointerEvents: isPending ? 'none' : 'auto' }} cursor={isPending ? 'progress' : 'auto'}>
            <VoxCard.Content paddingBottom={0} justifyContent="center" alignItems="center">
              <VoxHeader.Title icon={Zap}>{`${editMode ? 'Modifier l’action' : 'Nouvelle action'}`}</VoxHeader.Title>
            </VoxCard.Content>
            {editMode ? null : (
              <VoxCard.Content paddingBottom={0} paddingTop={0}>
                <MessageCard theme="gray" iconLeft={Info}>
                  Créez un événement pour faire campagne, rassembler vos militants ou récompenser vos adhérents.
                </MessageCard>
              </VoxCard.Content>
            )}
            <XStack alignItems="stretch" paddingVertical="$medium">
              <YStack flex={1} flexShrink={1} minWidth={0} maxWidth={450} gap="$medium" paddingHorizontal="$medium">
                <ActionFormMain />
              </YStack>
              <YStack flex={1} flexShrink={1} minWidth={0} maxWidth={450} paddingHorizontal="$medium">
                <ActionFormAside />
              </YStack>
            </XStack>
            <VoxCard.Content pt={0}>
              <ActionFormActions />
            </VoxCard.Content>
          </VoxCard>
          {isPending ? (
            <YStack top={0} bottom={0} left={0} right={0} position="absolute" justifyContent="center" alignItems="center">
              <Spinner size="large" color="$purple6" />
            </YStack>
          ) : null}
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}
