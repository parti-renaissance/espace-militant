import { ComponentRef, useCallback, useEffect, type RefObject } from 'react'
import type { LayoutChangeEvent, NativeSyntheticEvent } from 'react-native'
import { Input, isWeb, useMedia, View, YStack } from 'tamagui'
import { ArrowUpRight } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button/Button'

export type TamaguiInputRef = ComponentRef<typeof Input> & {
  getNativeRef?: () => ComponentRef<typeof Input> | null
}

type Props = {
  inputRef: RefObject<TamaguiInputRef | null>
  value: string
  isLoading: boolean
  bottomOffset: number
  onChange: (value: string) => void
  onSubmit: () => void
  onStop: () => void
  onLayout: (e: LayoutChangeEvent) => void
}

export function InputDock({ inputRef, value, isLoading, bottomOffset, onChange, onSubmit, onStop, onLayout }: Props) {
  const media = useMedia()

  useEffect(() => {
    if (!isWeb || !inputRef.current) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSubmit()
      }
    }

    const element = inputRef.current
    const textarea = element?.getNativeRef?.() || element
    const nativeNode = (textarea as { _nativeNode?: HTMLElement })?._nativeNode
    const domElement = nativeNode || (textarea as unknown as HTMLElement | null)

    if (domElement && domElement instanceof HTMLElement) {
      domElement.addEventListener('keydown', handleKeyDown)
      return () => domElement.removeEventListener('keydown', handleKeyDown)
    }
  }, [inputRef, onSubmit])

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
    >
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
            onSubmitEditing={isWeb ? undefined : onSubmit}
            borderWidth={0}
            focusStyle={{ outlineWidth: 0 }}
            maxHeight={160}
            textAlignVertical="top"
            placeholder="Formulez votre demande"
            editable
          />
        </View>
        <View flex={1} pb="$medium" pt={4} paddingHorizontal={16} flexDirection="row" gap="$small" justifyContent="flex-end">
          {isLoading && (
            <VoxButton theme="gray" onPress={onStop} shrink>
              Arrêter
            </VoxButton>
          )}
          <VoxButton theme="blue" onPress={onSubmit} iconLeft={ArrowUpRight} shrink loading={isLoading} disabled={!value.trim() || isLoading} />
        </View>
      </YStack>
    </YStack>
  )
}

export default InputDock
