import React, { useCallback, useEffect, useRef } from 'react'
import { LayoutChangeEvent } from 'react-native'
import Animated, { runOnUI, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Text, View, XStack } from 'tamagui'

type Option = { label: string; value: string | undefined }
export type OptionsArray = [Option, Option] | [Option, Option, Option] | [Option, Option, Option, Option] | [Option, Option, Option, Option, Option]

type Props = {
  options: OptionsArray
  value: string | undefined
  onChange: (x: string | undefined) => void
}

const HEIGHT = 44
const PADDING = 4

const BigSwitch = ({ options, value, onChange }: Props) => {
  const selectedIndex = options.findIndex((opt) => opt.value === value)

  // 1. SharedValues pour la géométrie (évite les re-renders via setState)
  const segmentWidth = useSharedValue(0)
  const translateX = useSharedValue(0)

  // 2. Animation UI pure
  const animatedStyle = useAnimatedStyle(() => ({
    width: segmentWidth.value,
    transform: [{ translateX: translateX.value }],
    opacity: segmentWidth.value > 0 ? 1 : 0, // Cache tant que le layout n'est pas prêt
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
      segmentWidth.value = sW
      // Position initiale sans animation
      translateX.value = selectedIndex >= 0 ? selectedIndex * sW : 0
    },
    [options.length, selectedIndex],
  )

  // 4. Synchronisation externe (ex: reset des filtres)
  useEffect(() => {
    runOnUI(animateToIndex)(selectedIndex >= 0 ? selectedIndex : 0)
  }, [selectedIndex, animateToIndex])

  // 5. Handler de clic optimisé
  const handlePress = (val: string | undefined, index: number) => {
    if (index === selectedIndex) return

    // On lance l'animation UI immédiatement
    runOnUI(animateToIndex)(index)

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
        >
          <Text fontWeight="600" fontSize={14} color={selectedIndex === index ? '$textPrimary' : '$textSecondary'} numberOfLines={1}>
            {option.label}
          </Text>
        </View>
      ))}
    </XStack>
  )
}

export default React.memo(BigSwitch)
