import Svg, { G, Path, type SvgProps } from 'react-native-svg'

type VideoPlayIconProps = SvgProps & {
  size?: number
}

export function VideoPlayIcon({ size = 80, ...props }: VideoPlayIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80" fill="none" {...props}>
      <G opacity={0.8}>
        <Path
          d="M15.3691 15.0319C15.3691 8.69495 22.1481 4.6665 27.7129 7.69203L73.6045 32.6647C79.4179 35.8276 79.4179 44.1736 73.6045 47.3366L27.7129 72.3053C22.1481 75.3346 15.3691 71.3026 15.3691 64.9694V15.0319Z"
          fill="white"
        />
      </G>
    </Svg>
  )
}
