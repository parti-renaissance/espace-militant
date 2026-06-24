import { type ReactNode, type RefObject } from 'react'
import { StyleSheet, type LayoutChangeEvent } from 'react-native'
import VoxBlur from '@/components/VoxBlur/VoxBlur'
import { isWeb, useMedia, YStack } from 'tamagui'
import type { TamaguiInputRef } from '@/hooks/chat/utils/getDomFromTamaguiRef'
import BotDisclaimer from './BotDisclaimer'
import ChatInput from './ChatInput'

type Props = {
  inputRef: RefObject<TamaguiInputRef | null>
  value: string
  isLoading: boolean
  keyboardOpen?: boolean
  bottomOffset: number
  placeholder?: string
  maxLength?: number
  topSlot?: ReactNode
  onChange: (value: string) => void
  onSubmit: () => void
  onStop: () => void
  onLayout: (e: LayoutChangeEvent) => void
}

export function InputDock({ inputRef, value, isLoading, keyboardOpen, bottomOffset, placeholder, maxLength, topSlot, onChange, onSubmit, onStop, onLayout }: Props) {
  const media = useMedia()

  return (
    <YStack
      onLayout={onLayout}
      position={isWeb ? 'fixed' : 'absolute'}
      bottom={bottomOffset}
      width="100%"
      maxWidth={media.gtSm ? 650 : '100%'}
      alignSelf="center"
      zIndex={100}
      pb={media.gtMd ? '$medium' : 0}
      paddingHorizontal={media.sm ? 16 : 0}
      gap="$small"
    >
      <VoxBlur variant="frosted" style={styles.blurBackground} pointerEvents="none" />
      <YStack fullscreen  pointerEvents="none" />
      {topSlot ? <YStack mb={16}>{topSlot}</YStack> : null}
      <ChatInput
        inputRef={inputRef}
        value={value}
        isLoading={isLoading}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={onChange}
        onSubmit={onSubmit}
        onStop={onStop}
      />
      {!keyboardOpen && <BotDisclaimer />}
    </YStack>
  )
}

const styles = StyleSheet.create({
  blurBackground: {
    ...StyleSheet.absoluteFill,
  },
})

export default InputDock
