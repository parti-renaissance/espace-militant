import React from 'react'
import { useMedia, XStack, YStack } from 'tamagui'
import { Controller } from 'react-hook-form'

import Text from '@/components/base/Text'
import { ActionType, ActionTypeIcon, ReadableActionType } from '@/services/actions/schema'

import ActionTypeSelector from '../../components/ActionTypeSelector'
import { useActionFormContext } from '../helpers/context'

export default function ActionTypeField() {
  const { control } = useActionFormContext()
  const media = useMedia()

  return (
    <YStack gap="$small">
      <Text.MD semibold>Type d’action</Text.MD>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, value } }) => (
          <XStack flexWrap="wrap" gap="$small">
            {Object.values(ActionType).map((el) => (
              <YStack key={el} width={media.sm ? '100%' : '48%'}>
                <ActionTypeSelector
                  compact={!media.sm}
                  label={ReadableActionType[el]}
                  Icon={ActionTypeIcon[el]}
                  description=""
                  selected={value === el}
                  onPress={() => onChange(el)}
                />
              </YStack>
            ))}
          </XStack>
        )}
      />
    </YStack>
  )
}
