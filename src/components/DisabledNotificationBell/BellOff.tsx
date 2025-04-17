import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

interface Props {
  size?: number
}

export default function BellOff({ size = 20 }: Readonly<Props>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.7 3A6 6 0 0118 8c0 1.684.202 3.363.6 5M17 17H3s3-2 3-9a4.67 4.67 0 01.3-1.7M10.3 21a1.94 1.94 0 003.4 0"
        stroke="#D26A4A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M2 2l20 20" stroke="#D26A4A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}
