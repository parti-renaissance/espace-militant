import { useCallback, useId, useRef, useState } from 'react'
import { Platform, View as RNView, ViewStyle } from 'react-native'
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg'
import type { TamaguiElement } from 'tamagui'

const GLOW_COLOR = '#4555D1'

export const PRONO_HERO_GLOW_WIDTH = 340
export const PRONO_HERO_GLOW_HEIGHT = 200

const glowWebStyle = {
  backgroundImage: 'radial-gradient(50% 50% at 50% 50%, rgba(69,85,209,0.95) 0%, rgba(69,85,209,0.6) 55%, rgba(69,85,209,0) 100%)',
} as unknown as ViewStyle

type GlowPosition = { left: number; top: number }

export function usePronoGlowCenter(width: number, height: number) {
  const containerRef = useRef<TamaguiElement>(null)
  const labelRef = useRef<RNView>(null)
  const [position, setPosition] = useState<GlowPosition | null>(null)

  const measure = useCallback(() => {
    const label = labelRef.current
    const container = containerRef.current
    if (!label || !container) return
    label.measureLayout(
      container as unknown as RNView,
      (x, y, labelWidth, labelHeight) => setPosition({ left: x + labelWidth / 2 - width / 2, top: y + labelHeight / 2 - height / 2 }),
      () => {},
    )
  }, [width, height])

  return { containerRef, labelRef, measure, position }
}

type PronoGlowProps = {
  position: GlowPosition | null
  width: number
  height: number
}

export default function PronoGlow({ position, width, height }: PronoGlowProps) {
  const rawId = useId()

  if (!position) return null

  const baseStyle = { position: 'absolute' as const, left: position.left, top: position.top, width, height }

  if (Platform.OS === 'web') {
    return <RNView pointerEvents="none" style={[baseStyle, glowWebStyle]} />
  }

  const gradientId = `pronoGlow${rawId.replace(/:/g, '')}`

  return (
    <RNView pointerEvents="none" style={baseStyle}>
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id={gradientId} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={GLOW_COLOR} stopOpacity={0.95} />
            <Stop offset="55%" stopColor={GLOW_COLOR} stopOpacity={0.6} />
            <Stop offset="100%" stopColor={GLOW_COLOR} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} fill={`url(#${gradientId})`} />
      </Svg>
    </RNView>
  )
}
