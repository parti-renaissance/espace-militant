import React, { memo, useMemo } from 'react'
import { Control, Controller } from 'react-hook-form'
import { XStack, YStack } from 'tamagui'
import { Clock } from '@tamagui/lucide-icons'
import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import Sender from '../../Sender'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { RestAvailableSendersResponse, RestGetMessageResponse } from '@/services/messages/schema'

export const MetaDataForm = memo((props: { control: Control<S.GlobalForm>, availableSenders?: RestAvailableSendersResponse, message?: RestGetMessageResponse, displayToolbar?: boolean }) => {
  const senderToDisplay = useMemo(() => {
    return props.message?.sender || (props.availableSenders && props.availableSenders.length > 0 ? props.availableSenders[0] : null)
  }, [props.message?.sender, props.availableSenders])

  const senderProps = useMemo(() => {
    if (!senderToDisplay) {
      return {
        name: null,
        role: undefined,
        pictureLink: undefined
      }
    }
    
    return {
      name: `${senderToDisplay?.first_name} ${senderToDisplay?.last_name}`,
      role: senderToDisplay?.role || undefined,
      pictureLink: senderToDisplay?.image_url || undefined,
      textColor: senderToDisplay?.theme?.primary ?? '$gray5'
    }
  }, [senderToDisplay])

  const memoizedSender = useMemo(() => {
    return <Sender sender={senderProps} />
  }, [senderProps])

  return (
    <YStack gap="$medium" backgroundColor="white" borderTopRightRadius="$medium" borderTopLeftRadius="$medium" padding="$medium" paddingBottom={props.displayToolbar ?  '$medium': 0}>
      <XStack justifyContent="space-between" gap="$small">
        <XStack
          backgroundColor={senderToDisplay?.theme?.soft ?? '$gray1'}
          borderRadius={999}
          paddingVertical={4}
          paddingHorizontal={8}
          alignItems="center"
          flexShrink={1}
        >
          <Text.SM semibold color={senderToDisplay?.theme?.primary ?? '$gray5'}  ellipsizeMode="tail" numberOfLines={1}>
            {senderToDisplay?.instance ?? 'Instance inconnue'} {senderToDisplay?.zone ? `• ${senderToDisplay?.zone}` : ''}
          </Text.SM>
        </XStack>
        <XStack gap="$small" alignItems="center">
          <Clock size={16} color="$textSecondary" />
          <Text.SM secondary>1 min.</Text.SM>
        </XStack>
      </XStack>
      {memoizedSender}
      <Controller
        control={props.control}
        name="metaData.subject"
        render={({ field, fieldState }) => {
          if (field.value && !props.displayToolbar) {
            return <Text.LG semibold mb="$medium">{field.value}</Text.LG>
          }
          return <Input placeholder="Titre de la publication" label="" color="gray" defaultValue={field.value} onBlur={field.onBlur} onChange={field.onChange} error={fieldState.error?.message} />
        }}
      />

    </YStack>
  )
})
