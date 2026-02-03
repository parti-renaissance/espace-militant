import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { XStack, Text } from 'tamagui'

type Option = { label: string; value: string | undefined }
export type OptionsArray = 
  | [Option, Option]
  | [Option, Option, Option]
  | [Option, Option, Option, Option]
  | [Option, Option, Option, Option, Option]

type Props = {
  options: OptionsArray
  value: string | undefined
  onChange: (x: string | undefined) => void
}

const HEIGHT = 44
const PADDING = 4

const BigSwitch = ({ options, value, onChange }: Props) => {
  const [containerW, setContainerW] = useState<number>(0)
  const prevW = useRef<number>(0)
  const isInitialMount = useRef(true)

  const selectedIndex = options.findIndex((opt) => opt.value === value)
  const innerW = Math.max(0, containerW - PADDING * 2)
  const segmentWidth = innerW / options.length

  const translateX = useSharedValue(0)

  useEffect(() => {
    const targetX = selectedIndex >= 0 ? selectedIndex * segmentWidth : 0
    if (isInitialMount.current) {
      translateX.value = targetX
      isInitialMount.current = false
    } else {
      translateX.value = withTiming(targetX, {
        duration: 300,
      })
    }
  }, [selectedIndex, segmentWidth, translateX])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    }
  })

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width
    if (Math.abs(w - prevW.current) > 1) {
      prevW.current = w
      setContainerW(w)
    }
  }, [])

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
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: PADDING,
            bottom: PADDING,
            left: PADDING,
            width: segmentWidth,
            borderRadius: 999,
            backgroundColor: 'white',
          },
          animatedStyle,
        ]}
      />

      {options.map((option, index) => (
        <XStack
          key={option.value ?? '__undefined__'}
          width={segmentWidth}
          alignItems="center"
          justifyContent="center"
          zIndex={1}
          cursor="pointer"
          onPress={() => onChange(option.value)}
          accessibilityRole="tab"
          aria-selected={selectedIndex === index}
        >
          <Text fontWeight="600" fontSize={14} color="$textPrimary">
            {option.label}
          </Text>
        </XStack>
      ))}
    </XStack>
  )
}

export default React.memo(BigSwitch)
