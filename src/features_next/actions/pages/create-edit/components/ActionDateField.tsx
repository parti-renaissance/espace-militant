import React, { memo } from 'react'
import { YStack } from 'tamagui'
import { Controller, type Control } from 'react-hook-form'

import DatePicker from '@/components/DatePicker'
import Text from '@/components/base/Text'

import type { ActionFormValues } from '@/services/actions/paramsMapper'

type ActionDateFieldProps = {
  control: Control<ActionFormValues>
}

function ActionDateField({ control }: ActionDateFieldProps) {
  return (
    <YStack gap="$medium">
      <Text fontSize={14} fontWeight="$6">
        Fixez un rendez-vous
      </Text>
      <YStack gap="$medium">
        <Controller
          control={control}
          name="date"
          render={({ field, fieldState }) => (
            <DatePicker
              label="Date"
              type="date"
              color="gray"
              error={fieldState.error?.message}
              onBlur={field.onBlur}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="date"
          render={({ field, fieldState }) => (
            <DatePicker
              label="Heure"
              type="time"
              color="gray"
              error={fieldState.error?.message ? ' ' : undefined}
              onBlur={field.onBlur}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </YStack>
    </YStack>
  )
}

export default memo(ActionDateField)
