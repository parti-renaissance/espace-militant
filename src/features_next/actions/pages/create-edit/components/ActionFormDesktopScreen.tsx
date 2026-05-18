import React from 'react'
import { Link, useNavigation } from 'expo-router'
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

import ActionAddressField from './ActionAddressField'
import ActionDateField from './ActionDateField'
import ActionTypeField from './ActionTypeField'
import { useActionFormContext } from '../helpers/context'

const ActionFormMain = () => {
  const { control } = useActionFormContext()

  return (
    <YStack gap="$medium">
      <ActionTypeField />
      <Controller
        render={({ field, fieldState }) => (
          <YStack minHeight={100} maxHeight={400}>
            <Input
              size="sm"
              color="gray"
              label="Description (optionnelle)"
              placeholder="Ajoutez une description"
              multiline
              numberOfLines={8}
              error={fieldState.error?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          </YStack>
        )}
        control={control}
        name="description"
      />
      <Text.XSM secondary>1000 caractères maximum</Text.XSM>
    </YStack>
  )
}

const ActionFormAside = () => {
  const { control } = useActionFormContext()

  return (
    <YStack gap="$medium">
      <ActionDateField control={control} />
      <ActionAddressField />
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
        <VoxButton onPress={onSubmit} size="md" variant="contained" theme="green" loading={isPending} iconLeft={Sparkle}>
          {isPending ? `${editMode ? 'Modification' : 'Création'}...` : `${editMode ? 'Modifier' : 'Créer'} l’action`}
        </VoxButton>
      </YStack>
    </XStack>
  )
}

const BackButton = (props: { href: string; children?: React.ReactNode }) => {
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
              <VoxHeader.Title icon={Zap}>{`${editMode ? 'Modifier' : 'Créer'} l’action`}</VoxHeader.Title>
            </VoxCard.Content>
            {editMode ? null : (
              <VoxCard.Content paddingBottom={0} paddingTop={0}>
                <MessageCard theme="gray" iconLeft={Info}>
                  Organisez une <Text.MD bold>action militante sur le terrain</Text.MD> pour mobiliser vos militants autour de vous.
                </MessageCard>
              </VoxCard.Content>
            )}
            <XStack alignItems="flex-start" paddingVertical="$medium">
              <YStack flex={1} flexShrink={1} gap="$medium" paddingHorizontal="$medium">
                <ActionFormMain />
              </YStack>
              <YStack maxWidth={400} paddingHorizontal="$medium" gap="$medium">
                <ActionFormAside />
              </YStack>
            </XStack>
            <VoxCard.Content pt={0}>
              <ActionFormActions />
            </VoxCard.Content>
          </VoxCard>
          {isPending ? (
            <YStack top={0} bottom={0} left={0} right={0} position="absolute" justifyContent="center" alignItems="center">
              <Spinner size="large" color="$green6" />
            </YStack>
          ) : null}
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}
