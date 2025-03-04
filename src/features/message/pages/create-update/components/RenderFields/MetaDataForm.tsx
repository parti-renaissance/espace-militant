import React, { memo } from 'react'
import Input from '@/components/base/Input/Input'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Control, Controller } from 'react-hook-form'
import { YStack } from 'tamagui'

export const MetaDataForm = memo((props: { control: Control<S.GlobalForm> }) => {
  return (
    <YStack paddingVertical="$large" paddingHorizontal="$medium">
      <Controller
        control={props.control}
        name="metaData.object"
        render={({ field, fieldState }) => {
          return <Input placeholder="Objet" defaultValue={field.value} onBlur={field.onBlur} onChange={field.onChange} error={fieldState.error?.message} />
        }}
      />
    </YStack>
  )
})
