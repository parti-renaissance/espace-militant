import React, { memo } from 'react'
import Input from '@/components/base/Input/Input'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { Control, Controller } from 'react-hook-form'
import { YStack } from 'tamagui'
import MessageScopeSelect from './MessageScopeSelect'

export const MetaDataForm = memo((props: { control: Control<S.GlobalForm> }) => {
  return (
    <YStack paddingVertical="$large" $sm={{ paddingHorizontal: '$medium' }} gap="$medium">
      <MessageScopeSelect control={props.control} />
      <Controller
        control={props.control}
        name="metaData.subject"
        render={({ field, fieldState }) => {
          return <Input placeholder="Objet" defaultValue={field.value} onBlur={field.onBlur} onChange={field.onChange} error={fieldState.error?.message} />
        }}
      />
    </YStack>
  )
})
