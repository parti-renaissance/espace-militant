import React from 'react'
import { Link } from 'expo-router'
import { isWeb, Spinner, XStack, YStack } from 'tamagui'
import { Ban, Info, Sparkle } from '@tamagui/lucide-icons'
import { Controller } from 'react-hook-form'

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

export default function ActionFormMobileScreen() {
  const { navigation, onSubmit, control, isPending, editMode, cancelHref, cancelModalRef } = useActionFormContext()

  return (
    <YStack flex={1} opacity={isPending ? 0.5 : 1} style={{ pointerEvents: isPending ? 'none' : 'auto' }} cursor={isPending ? 'progress' : 'auto'}>
      <VoxHeader>
        <XStack alignItems="center" flex={1} width="100%">
          <XStack alignContent="flex-start">
            <Link href={navigation.canGoBack() ? '../' : cancelHref} replace asChild={!isWeb}>
              {isPending ? null : (
                <VoxButton size="lg" variant="text" theme="orange">
                  Annuler
                </VoxButton>
              )}
            </Link>
          </XStack>
          <XStack flexGrow={1} justifyContent="center">
            <VoxHeader.Title>{`${editMode ? 'Modifier' : 'Créer'} l’action`}</VoxHeader.Title>
          </XStack>
          <XStack>
            <VoxButton onPress={onSubmit} size="md" theme="green" loading={isPending} iconLeft={editMode ? undefined : Sparkle}>
              {isPending ? `${editMode ? 'Modification' : 'Création'}...` : editMode ? 'Modifier' : 'Créer'}
            </VoxButton>
          </XStack>
        </XStack>
      </VoxHeader>

      <LayoutScrollView padding={false} keyboardShouldPersistTaps="handled">
        <YStack paddingBottom={100}>
          <VoxCard borderWidth={0}>
            {editMode ? null : (
              <MessageCard theme="gray" iconLeft={Info}>
                Organisez une <Text.MD bold>action militante sur le terrain</Text.MD> pour mobiliser vos militants autour de vous.
              </MessageCard>
            )}
            <VoxCard.Content>
              <ActionTypeField />
              <VoxCard.Separator />
              <ActionDateField control={control} />
              <VoxCard.Separator />
              <ActionAddressField />
              <VoxCard.Separator />
              <YStack>
                <Controller
                  render={({ field, fieldState }) => (
                    <YStack minHeight={100} maxHeight={300}>
                      <Input
                        size="sm"
                        color="gray"
                        label="Description (optionnelle)"
                        placeholder="Ajoutez une description"
                        multiline
                        numberOfLines={5}
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
                <Text.XSM secondary mt="$xsmall">
                  1000 caractères maximum
                </Text.XSM>
              </YStack>
            </VoxCard.Content>
            {editMode ? (
              <VoxCard.Content>
                <VoxButton variant="text" theme="orange" iconLeft={Ban} onPress={() => cancelModalRef.current?.present()}>
                  Annuler l’action
                </VoxButton>
              </VoxCard.Content>
            ) : null}
          </VoxCard>
        </YStack>
      </LayoutScrollView>
      {isPending ? (
        <YStack top={0} bottom={0} left={0} right={0} position="absolute" justifyContent="center" alignItems="center">
          <Spinner size="large" color="$green6" />
        </YStack>
      ) : null}
    </YStack>
  )
}
