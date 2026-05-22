import { useCallback, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, type NativeSyntheticEvent } from 'react-native'
import { Input, isWeb, useMedia, View, YStack } from 'tamagui'
import { ArrowUpRight, Square } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button/Button'

import { BOT_MESSAGE_MAX_LENGTH } from '@/services/bot/api'
import { useAutoGrowTextarea } from '../hooks/useAutoGrowTextarea'
import { useEnterKeySubmit } from '../hooks/useEnterKeySubmit'
import type { TamaguiInputRef } from '../utils/getDomFromTamaguiRef'

type Props = {
  inputRef: RefObject<TamaguiInputRef | null>
  value: string
  isLoading: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  onStop: () => void
}

export function ChatInput({ inputRef, value, isLoading, onChange, onSubmit, onStop }: Props) {
  const { t } = useTranslation()
  const media = useMedia()

  useEnterKeySubmit(inputRef, onSubmit)
  useAutoGrowTextarea(inputRef, value)

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<{ key: string; shiftKey?: boolean }>) => {
      if (!isWeb) return
      const { key, shiftKey } = e.nativeEvent
      if (key === 'Enter' && !shiftKey) {
        e.preventDefault?.()
        onSubmit()
        return false
      }
    },
    [onSubmit],
  )

  const handleNativeSubmit = useCallback(() => {
    if (!isWeb) Keyboard.dismiss()
    onSubmit()
  }, [onSubmit])

  return (
    <YStack
      backgroundColor="$white1"
      borderColor="$textOutline"
      borderWidth={1}
      borderTopLeftRadius={24}
      borderTopRightRadius={24}
      borderBottomLeftRadius={media.gtMd ? 24 : 0}
      borderBottomRightRadius={media.gtMd ? 24 : 0}
      overflow="hidden"
    >
      <View paddingTop={8}>
        <Input
          ref={inputRef}
          multiline
          value={value}
          onChangeText={onChange}
          onKeyPress={!isWeb ? handleKeyPress : undefined}
          onSubmitEditing={isWeb ? undefined : handleNativeSubmit}
          borderWidth={0}
          focusStyle={{ outlineWidth: 0 }}
          maxHeight={520}
          maxLength={BOT_MESSAGE_MAX_LENGTH}
          textAlignVertical="top"
          placeholder={t('bot.placeholder')}
          editable
        />
      </View>
      <View flex={1} pt={4} mb={16} paddingHorizontal={16} flexDirection="row" gap="$small" justifyContent="flex-end" alignItems="center">
        <VoxButton
          theme="blue"
          onPress={isLoading ? onStop : onSubmit}
          iconLeft={isLoading ? Square : ArrowUpRight}
          shrink
          disabled={!isLoading && !value.trim()}
        />
      </View>
    </YStack>
  )
}

export default ChatInput
