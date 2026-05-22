import { type RefObject } from 'react'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { isWeb, useMedia, YStack } from 'tamagui'

import type { TamaguiInputRef } from '../../utils/getDomFromTamaguiRef'
import BotDisclaimer from './BotDisclaimer'
import ChatInput from './ChatInput'
import SuggestionsList from './SuggestionsList'

type Props = {
  inputRef: RefObject<TamaguiInputRef | null>
  value: string
  isLoading: boolean
  showSuggestions: boolean
  keyboardHeight: number
  onChange: (value: string) => void
  onSubmit: () => void
  onStop: () => void
  onSuggestionPress: (question: string) => void
}

export function InputDock({ inputRef, value, isLoading, showSuggestions, keyboardHeight, onChange, onSubmit, onStop, onSuggestionPress }: Props) {
  const media = useMedia()
  const insets = useSafeAreaInsets()

  return (
    <YStack
      position={isWeb ? 'fixed' : 'absolute'}
      bottom={isWeb ? 0 : keyboardHeight + (Platform.OS === 'ios' ? insets.bottom : 16)}
      width="100%"
      maxWidth={media.gtSm ? 520 : '100%'}
      alignSelf="center"
      zIndex={100}
      bg="$textSurface"
      pb={media.gtMd ? '$medium' : 0}
      paddingHorizontal={media.sm ? 16 : 0}
      gap="$small"
    >
      {showSuggestions && <SuggestionsList onPress={onSuggestionPress} />}
      <ChatInput inputRef={inputRef} value={value} isLoading={isLoading} onChange={onChange} onSubmit={onSubmit} onStop={onStop} />
      <BotDisclaimer />
    </YStack>
  )
}

export default InputDock
