import { ComponentProps, ReactNode, RefObject, type CSSProperties } from 'react'
import { Platform, StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'
import { BlurTargetView, BlurView } from 'expo-blur'
import type { BlurTargetViewProps } from 'expo-blur'
import { isWeb } from 'tamagui'

type BlurViewProps = ComponentProps<typeof BlurView>

type BlurWebStyle = Pick<CSSProperties, 'backdropFilter' | 'WebkitBackdropFilter'>

type BlurPreset = {
  intensity?: BlurViewProps['intensity']
  tint?: BlurViewProps['tint']
  blurMethod?: BlurViewProps['blurMethod']
  backgroundColor?: string
  webStyle?: BlurWebStyle
}

type VoxBlurVariant = 'overlay' | 'frosted' | 'chrome' | 'card'

const BLUR_PRESETS: Record<VoxBlurVariant, BlurPreset> = {
  overlay: {
    intensity: 50,
    blurMethod: 'dimezisBlurView',
  },
  frosted: {
    intensity: 18,
    tint: 'light',
    blurMethod: 'dimezisBlurView',
  },
  chrome: {},
  card: {
    intensity: 40,
    tint: 'extraLight',
    blurMethod: 'dimezisBlurView',
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
    webStyle: {
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    },
  },
}

export function VoxBlurTarget({ ref, ...viewProps }: BlurTargetViewProps) {
  return <BlurTargetView ref={ref} {...viewProps} />
}

type BlurLayerProps = {
  blurTarget?: RefObject<View | null>
  intensity?: number
  tint?: BlurViewProps['tint']
  blurMethod?: BlurViewProps['blurMethod']
  pointerEvents?: BlurViewProps['pointerEvents']
  style?: StyleProp<ViewStyle>
  children?: ReactNode
}

function BlurLayer({ blurTarget, intensity, tint, blurMethod, pointerEvents, style, children }: BlurLayerProps) {
  return (
    <BlurView blurTarget={blurTarget} intensity={intensity} tint={tint} blurMethod={blurMethod} pointerEvents={pointerEvents} style={style}>
      {children}
    </BlurView>
  )
}

export type VoxBlurProps = {
  variant?: VoxBlurVariant
  blurTarget?: RefObject<View | null>
  intensity?: number
  tint?: BlurViewProps['tint']
  style?: StyleProp<ViewStyle>
  fullscreen?: boolean
  pointerEvents?: BlurViewProps['pointerEvents']
  children?: ReactNode
}

export function VoxBlur({
  variant = 'frosted',
  blurTarget,
  intensity: intensityProp,
  tint: tintProp,
  style,
  fullscreen = false,
  pointerEvents,
  children,
}: VoxBlurProps) {
  const preset = BLUR_PRESETS[variant]
  const intensity = intensityProp ?? preset.intensity
  const tint = tintProp ?? preset.tint
  const blurMethod = Platform.OS === 'android' ? preset.blurMethod : undefined
  const { backgroundColor, webStyle } = preset

  const fullscreenStyle = fullscreen ? styles.fullscreen : undefined
  const layerProps = { blurTarget, intensity, tint, blurMethod }

  if (isWeb && webStyle != null) {
    return (
      <View pointerEvents={pointerEvents} style={[fullscreenStyle, style, backgroundColor != null && { backgroundColor }, webStyle]}>
        {children}
      </View>
    )
  }

  if (backgroundColor != null) {
    return (
      <View pointerEvents={pointerEvents} style={[fullscreenStyle, style, styles.withBackground]}>
        <BlurLayer {...layerProps} pointerEvents="none" style={StyleSheet.absoluteFill} />
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor }]} />
        {children}
      </View>
    )
  }

  return (
    <BlurLayer {...layerProps} pointerEvents={pointerEvents} style={[fullscreenStyle, style]}>
      {children}
    </BlurLayer>
  )
}

const styles = StyleSheet.create({
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
  },
  withBackground: {
    overflow: 'hidden',
  },
})

export default VoxBlur
