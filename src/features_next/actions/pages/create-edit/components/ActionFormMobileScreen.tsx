import React from 'react'
import { Link, useNavigation } from 'expo-router'
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

import { useActionFormContext } from '../helpers/context'
import ActionAddressField from './ActionAddressField'
import ActionDateField from './ActionDateField'
import ActionTypeField from './ActionTypeField'

export default function ActionFormMobileScreen() {
  const { canGoBack } = useNavigation()
  const { onSubmit, control, isPending, editMode, cancelHref, cancelModalRef } = useActionFormContext()

  return (
    <YStack flex={1} opacity={isPending ? 0.5 : 1} style={{ pointerEvents: isPending ? 'none' : 'auto' }} cursor={isPending ? 'progress' : 'auto'}>
      <VoxHeader>
        <XStack alignItems="center" flex={1} width="100%">
          <XStack alignContent="flex-start">
            <Link href={canGoBack() ? '../' : cancelHref} replace asChild={!isWeb}>
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
            <VoxButton onPress={onSubmit} size="md" theme="purple" loading={isPending} iconLeft={editMode ? undefined : Sparkle}>
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
                Créez un événement pour faire campagne, rassembler vos militants ou récompenser vos adhérents.
              </MessageCard>
            )}
            <VoxCard.Content>
              <XStack gap="$medium" alignContent="center" alignItems="center">
                <Text.MD secondary>Catégorie</Text.MD>
                <VoxCard.Separator />
              </XStack>
              <ActionTypeField />
              <VoxCard.Separator />
              <ActionDateField control={control} />
              <ActionAddressField />
              <XStack gap="$medium" alignContent="center" alignItems="center">
                <Text.MD secondary>Optionnel</Text.MD>
                <VoxCard.Separator />
              </XStack>
              <YStack>
                <Controller
                  render={({ field, fieldState }) => (
                    <YStack minHeight={200} maxHeight={300}>
                      <Input
                        size="sm"
                        color="gray"
                        placeholder="Description"
                        multiline
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
