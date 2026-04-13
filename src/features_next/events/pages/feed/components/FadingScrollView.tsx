import { useCallback, useEffect, useState } from 'react'
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollViewProps } from 'react-native'
import { ScrollView, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { YStack } from 'tamagui'

const GRADIENT_FADE_MS = 100

type ScrollMetrics = { contentW: number; layoutW: number; offsetX: number }

function useHorizontalScrollFade() {
  const [metrics, setMetrics] = useState<ScrollMetrics>({ contentW: 0, layoutW: 0, offsetX: 0 })

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent> | undefined) => {
    const nativeEvent = e?.nativeEvent
    if (!nativeEvent) return
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent
    setMetrics({
      contentW: contentSize.width,
      layoutW: layoutMeasurement.width,
      offsetX: contentOffset.x,
    })
  }, [])

  const onContentSizeChange = useCallback((w: number) => {
    setMetrics((s) => ({ ...s, contentW: w }))
  }, [])

  const onLayout = useCallback((e: LayoutChangeEvent | { layout?: { width?: number } } | undefined) => {
    const eventObj = e as { nativeEvent?: { layout?: { width?: number } }; layout?: { width?: number } } | undefined
    const width = eventObj?.nativeEvent?.layout?.width ?? eventObj?.layout?.width
    if (typeof width !== 'number' || !Number.isFinite(width)) return
    setMetrics((s) => ({ ...s, layoutW: width }))
  }, [])

  const scrollable = Math.max(0, metrics.contentW - metrics.layoutW)
  const eps = 2
  const canScroll = scrollable > eps
  const showLeftFade = canScroll && metrics.offsetX > eps
  const showRightFade = canScroll && metrics.offsetX < scrollable - eps

  const leftOpacitySv = useSharedValue(0)
  const rightOpacitySv = useSharedValue(0)

  useEffect(() => {
    leftOpacitySv.value = withTiming(showLeftFade ? 1 : 0, { duration: GRADIENT_FADE_MS })
    rightOpacitySv.value = withTiming(showRightFade ? 1 : 0, { duration: GRADIENT_FADE_MS })
  }, [showLeftFade, showRightFade, leftOpacitySv, rightOpacitySv])

  const leftFadeStyle = useAnimatedStyle(() => ({ opacity: leftOpacitySv.value }))
  const rightFadeStyle = useAnimatedStyle(() => ({ opacity: rightOpacitySv.value }))

  return { onScroll, onContentSizeChange, onLayout, leftFadeStyle, rightFadeStyle }
}

export interface FadingScrollViewProps extends ScrollViewProps {
  gradientColors?: readonly [string, string]
  gradientWidth?: number
  showGradients?: boolean
}

export function FadingScrollView({
  children,
  gradientColors = ['#fafafb', '#fafafb00'],
  gradientWidth = 40,
  showGradients = true,
  onScroll: externalOnScroll,
  onContentSizeChange: externalOnContentSizeChange,
  onLayout: externalOnLayout,
  ...props
}: FadingScrollViewProps) {
  const { onScroll, onContentSizeChange, onLayout, leftFadeStyle, rightFadeStyle } = useHorizontalScrollFade()

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScroll(e)
      externalOnScroll?.(e)
    },
    [onScroll, externalOnScroll],
  )

  const handleContentSizeChange = useCallback(
    (w: number, h: number) => {
      onContentSizeChange(w)
      externalOnContentSizeChange?.(w, h)
    },
    [onContentSizeChange, externalOnContentSizeChange],
  )

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      onLayout(e)
      externalOnLayout?.(e)
    },
    [onLayout, externalOnLayout],
  )

  return (
    <YStack width="100%" position="relative">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        {...props}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
      >
        {children}
      </ScrollView>

      {showGradients && (
        <>
          <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: 0, left: 0, bottom: 0, zIndex: 1, width: gradientWidth }, leftFadeStyle]}>
            <LinearGradient colors={gradientColors} start={[0, 0]} end={[1, 0]} style={StyleSheet.absoluteFill} />
          </Animated.View>
          <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 1, width: gradientWidth }, rightFadeStyle]}>
            <LinearGradient colors={gradientColors} start={[1, 0]} end={[0, 0]} style={StyleSheet.absoluteFill} />
          </Animated.View>
        </>
      )}
    </YStack>
  )
}
