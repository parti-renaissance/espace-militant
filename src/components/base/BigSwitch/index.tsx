import React, { useCallback, useEffect } from 'react'
import { LayoutChangeEvent } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { scheduleOnUI } from 'react-native-worklets'
import { Text, useTheme, View, XStack } from 'tamagui'

import type { IconComponent } from '@/models/common.model'

type Option = {
  label: string
  value: string | undefined
  iconLeft?: IconComponent
  activeTheme?: {
    backgroundColor?: string
    textColor?: string
  }
}
export type OptionsArray = [Option, Option] | [Option, Option, Option] | [Option, Option, Option, Option] | [Option, Option, Option, Option, Option]

type Props = {
  options: OptionsArray
  value: string | undefined
  onChange: (x: string | undefined) => void
}

const HEIGHT = 44
const PADDING = 4

const BigSwitch = ({ options, value, onChange }: Props) => {
  const theme = useTheme()
  const selectedIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === value),
  )
  const selectedOption = options[selectedIndex]
  const resolveThemeColor = useCallback(
    (color?: string) => {
      if (!color) return undefined
      if (!color.startsWith('$')) return color
      const token = color.slice(1)
      const tokenEntry = (theme as Record<string, { val?: string }>)[token]
      return tokenEntry?.val ?? color
    },
    [theme],
  )
  const activeBackgroundColor = resolveThemeColor(selectedOption?.activeTheme?.backgroundColor) ?? resolveThemeColor('$textOutline20') ?? '#E5E7EB'
  const activeTextColor = selectedOption?.activeTheme?.textColor ?? '$textPrimary'

  // 1. SharedValues pour la géométrie (évite les re-renders via setState)
  const segmentWidth = useSharedValue(0)
  const translateX = useSharedValue(0)
  const backgroundColor = useSharedValue(activeBackgroundColor)

  // 2. Animation UI pure
  const animatedStyle = useAnimatedStyle(() => ({
    width: segmentWidth.value,
    transform: [{ translateX: translateX.value }],
    opacity: segmentWidth.value > 0 ? 1 : 0, // Cache tant que le layout n'est pas prêt
  }))

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }))

  // Fonction d'animation exportée vers le thread UI
  const animateToIndex = useCallback((index: number) => {
    'worklet'
    if (segmentWidth.value > 0) {
      translateX.value = withTiming(index * segmentWidth.value, { duration: 250 })
    }
  }, [])

  // 3. Gestion du Layout (Zéro re-render React)
  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width
      const sW = (w - PADDING * 2) / options.length
      const isFirstMeasure = segmentWidth.value === 0
      segmentWidth.value = sW
      // Position initiale sans animation uniquement au premier layout.
      // Sinon, on laisse les animations piloter translateX.
      if (isFirstMeasure) {
        translateX.value = selectedIndex * sW
      }
    },
    [options.length, selectedIndex, segmentWidth, translateX],
  )

  // 4. Synchronisation externe (ex: reset des filtres)
  useEffect(() => {
    scheduleOnUI(animateToIndex, selectedIndex)
  }, [selectedIndex, animateToIndex])

  useEffect(() => {
    backgroundColor.value = withTiming(activeBackgroundColor, { duration: 250 })
  }, [activeBackgroundColor, backgroundColor])

  // 5. Handler de clic optimisé
  const handlePress = (val: string | undefined, index: number) => {
    if (index === selectedIndex) return

    // On lance l'animation UI immédiatement
    scheduleOnUI(animateToIndex, index)

    // On délègue la mise à jour lourde au cycle suivant pour laisser
    // l'animation démarrer avant que le JS Thread ne freeze
    setTimeout(() => {
      onChange(val)
    }, 0)
  }

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
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: 999,
          },
          backgroundAnimatedStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: PADDING,
            bottom: PADDING,
            left: PADDING,
            borderRadius: 999,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          },
          animatedStyle,
        ]}
      />

      {options.map((option, index) => (
        <View
          key={option.value ?? `opt-${index}`}
          flex={1}
          flexBasis={0}
          minWidth={0}
          alignItems="center"
          justifyContent="center"
          onPress={() => handlePress(option.value, index)}
          hitSlop={8}
          zIndex={1}
          cursor={index === selectedIndex ? 'default' : 'pointer'}
        >
          <XStack alignItems="flex-end" gap="$small">
            {option.iconLeft ? <option.iconLeft size={16} color={selectedIndex === index ? activeTextColor : '$textPrimary'} /> : null}
            <Text fontWeight="600" fontSize={14} color={selectedIndex === index ? activeTextColor : '$textPrimary'} numberOfLines={1}>
              {option.label}
            </Text>
          </XStack>
        </View>
      ))}
    </XStack>
  )
}

export default React.memo(BigSwitch)
