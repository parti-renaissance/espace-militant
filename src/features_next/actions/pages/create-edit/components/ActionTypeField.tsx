import React from 'react'
import { XStack, YStack } from 'tamagui'
import { Controller } from 'react-hook-form'

import Text from '@/components/base/Text'

import { ActionType, ActionTypeIcon, ReadableActionType } from '@/services/actions/schema'

import { useActionFormContext } from '../helpers/context'
import ActionTypeSelector from './ActionTypeSelector'

export default function ActionTypeField() {
  const { control } = useActionFormContext()

  return (
    <YStack gap="$small">
      <Text.MD semibold>Type d’action</Text.MD>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, value } }) => (
          <XStack flexWrap="wrap" gap="$small">
            {Object.values(ActionType).map((el) => (
              <ActionTypeSelector label={ReadableActionType[el]} Icon={ActionTypeIcon[el]} selected={value === el} onPress={() => onChange(el)} />
            ))}
          </XStack>
        )}
      />
    </YStack>
  )
}
