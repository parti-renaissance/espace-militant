import React, { useCallback, useMemo, useRef, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { XStack, Text, Stack } from 'tamagui'

type Option = { label: string; value: string }
export type OptionsTuple = [Option, Option]

type Props = {
  options: OptionsTuple
  value: string
  onChange: (x: string) => void
}

const HEIGHT = 44
const PADDING = 4

const BigSwitch = ({ options, value, onChange }: Props) => {
  const [containerW, setContainerW] = useState<number>(0)
  const prevW = useRef<number>(0)

  const isFirst = value === options[0].value
  const innerW = Math.max(0, containerW - PADDING * 2)
  const halfW = innerW / 2

  const translateX = useMemo(() => (isFirst ? 0 : halfW), [isFirst, halfW])

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width
    if (Math.abs(w - prevW.current) > 1) {
      prevW.current = w
      setContainerW(w)
    }
  }, [])

  const handleLeft = useCallback(() => onChange(options[0].value), [onChange, options])
  const handleRight = useCallback(() => onChange(options[1].value), [onChange, options])

  return (
    <XStack
      flex={1}
      height={HEIGHT}
      borderRadius={999}
      backgroundColor="$textOutline20"
      position="relative"
      overflow="hidden"
      padding={PADDING}
      onLayout={onLayout}
      role="tablist"
      aria-label="Big switch"
    >
      <Stack
        position="absolute"
        top={PADDING}
        bottom={PADDING}
        left={PADDING}
        width={halfW}
        borderRadius={999}
        backgroundColor="$white1"
        animation="medium"
        transform={[{ translateX }]}
      />

      <XStack
        width="50%"
        alignItems="center"
        justifyContent="center"
        zIndex={1}
        cursor="pointer"
        onPress={handleLeft}
        accessibilityRole="tab"
        aria-selected={isFirst}
      >
        <Text fontWeight="600" fontSize={14} color="$textPrimary">
          {options[0].label}
        </Text>
      </XStack>

      <XStack
        width="50%"
        alignItems="center"
        justifyContent="center"
        zIndex={1}
        cursor="pointer"
        onPress={handleRight}
        accessibilityRole="tab"
        aria-selected={!isFirst}
      >
        <Text fontWeight="600" fontSize={14} color="$textPrimary">
          {options[1].label}
        </Text>
      </XStack>
    </XStack>
  )
}

export default React.memo(BigSwitch)
