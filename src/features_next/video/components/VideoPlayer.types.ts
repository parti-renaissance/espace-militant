export type VideoPlayerProps = {
  hlsUrl: string
  thumbnailUrl: string
  width?: number
  height?: number
  autoPlay?: boolean
  loop?: boolean
}

export const getVideoAspectRatio = (width?: number, height?: number) => (height && height > 0 && width ? width / height : 16 / 9)
