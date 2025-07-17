import React, { memo, useMemo } from 'react'
import { Control, Controller } from 'react-hook-form'
import { YStack } from 'tamagui'
import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import SenderView from '../../SenderView'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { RestAvailableSendersResponse, RestGetMessageResponse } from '@/services/publications/schema'
import Animated from 'react-native-reanimated'

export const MetaDataForm = memo((props: { control: Control<S.GlobalForm>, availableSenders?: RestAvailableSendersResponse, message?: RestGetMessageResponse, displayToolbar?: boolean }) => {
  const senderToDisplay = useMemo(() => {
    return props.message?.sender || (props.availableSenders && props.availableSenders.length > 0 ? props.availableSenders[0] : null)
  }, [props.message?.sender, props.availableSenders])

  return (
    <YStack gap="$medium" backgroundColor="white" borderTopRightRadius="$medium" borderTopLeftRadius="$medium" paddingHorizontal="$medium" paddingTop="$large" paddingBottom={props.displayToolbar ?  '$medium': 0}>
      <SenderView sender={senderToDisplay} datetime="1 min."/>
      <Controller
        control={props.control}
        name="metaData.subject"
        render={({ field, fieldState }) => {
          return (
            <Animated.View style={{ height: 'auto' }}>
              {field.value && !props.displayToolbar ? (
                <Text.LG semibold mb="$large">{field.value}</Text.LG>
              ) : (
                <Input placeholder="Titre de la publication" label="" color="gray" defaultValue={field.value} onBlur={field.onBlur} onChange={field.onChange} error={fieldState.error?.message} />
              )}
            </Animated.View>
          )
        }}
      />

    </YStack>
  )
})
