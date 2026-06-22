import React, { memo } from 'react'
import { Circle, Path, Svg } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'
import type { IconProps } from '@tamagui/helpers-icon'

const Icon = (props: IconProps) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...otherProps}>
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M11.9 6.7s-3 1.3-5 3.6c0 0 0 3.6 1.9 5.9 0 0 3.1.7 6.2 0 0 0 1.9-2.3 1.9-5.9 0 .1-2-2.3-5-3.6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M11.9 6.7V2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16.9 10.4s3-1.4 4.5-1.6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 16.3s1.9 2.7 2.9 3.7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8.8 16.3S6.9 19 6 20" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M2.6 8.7C4 9 7 10.4 7 10.4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

Icon.displayName = 'SoccerBall'

export const SoccerBall = memo<IconProps>(themed(Icon))

export default SoccerBall
