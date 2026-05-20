import React, { memo } from 'react'
import { XStack, YStack } from 'tamagui'
import { Controller, type Control } from 'react-hook-form'

import { FormFrame } from '@/components/base/FormFrames'
import Text from '@/components/base/Text'
import DatePickerField from '@/components/DatePickerV2'

import type { ActionFormValues } from '@/services/actions/paramsMapper'

type ActionDateFieldProps = {
  control: Control<ActionFormValues>
}

function ActionDateField({ control }: ActionDateFieldProps) {
  return (
    <Controller
      control={control}
      name="date"
      render={({ field, fieldState }) => (
        <YStack>
          <FormFrame height="auto" flexDirection="column" paddingHorizontal={0} py="$small" overflow="hidden" theme="gray" size="lg">
            <XStack paddingHorizontal="$medium" alignItems="center" alignContent="center" justifyContent="space-between">
              <XStack flex={1}>
                <FormFrame.Label>Date</FormFrame.Label>
              </XStack>
              <XStack gap="$small" flex={1} justifyContent="flex-end">
                <DatePickerField error={fieldState.error?.message} type="date" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                <DatePickerField error={fieldState.error?.message} type="time" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
              </XStack>
            </XStack>
          </FormFrame>
          {fieldState.error ? (
            <XStack paddingHorizontal="$medium" alignSelf="flex-start" pt="$xsmall">
              <Text.XSM color="$orange5">{fieldState.error.message}</Text.XSM>
            </XStack>
          ) : null}
        </YStack>
      )}
    />
  )
}

export default memo(ActionDateField)
