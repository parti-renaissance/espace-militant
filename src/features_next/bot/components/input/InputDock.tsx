import { type RefObject } from 'react'
import type { LayoutChangeEvent } from 'react-native'
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
  keyboardOpen: boolean
  bottomOffset: number
  onChange: (value: string) => void
  onSubmit: () => void
  onStop: () => void
  onSuggestionPress: (question: string) => void
  onLayout: (e: LayoutChangeEvent) => void
}

export function InputDock({ inputRef, value, isLoading, showSuggestions, keyboardOpen, bottomOffset, onChange, onSubmit, onStop, onSuggestionPress, onLayout }: Props) {
  const media = useMedia()

  return (
    <YStack
      onLayout={onLayout}
      position={isWeb ? 'fixed' : 'absolute'}
      bottom={bottomOffset}
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
      {!keyboardOpen && <BotDisclaimer />}
    </YStack>
  )
}

export default InputDock
