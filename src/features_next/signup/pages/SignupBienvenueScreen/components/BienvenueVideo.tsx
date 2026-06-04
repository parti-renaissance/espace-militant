import { Circle, isWeb, Spinner, YStack } from 'tamagui'

import Text from '@/components/base/Text'
import VideoPlayer from '@/features_next/video/components/VideoPlayer'
import { getVideoAspectRatio } from '@/features_next/video/components/VideoPlayer.types'

import type { RestGetVideoResponse } from '@/services/video/schema'

/** Ratio par défaut (verticale) — aligné sur le layout desktop. */
const BIENVENUE_VIDEO_ASPECT_RATIO = 9 / 16

type BienvenueVideoProps = {
  data: RestGetVideoResponse | undefined
  isLoading: boolean
  isError: boolean
  isScreenFocused: boolean
  maxHeight?: number
  fillAvailableSpace?: boolean
}

export default function BienvenueVideo({
  data,
  isLoading,
  isError,
  isScreenFocused,
  maxHeight,
  fillAvailableSpace = false,
}: BienvenueVideoProps) {
  const aspectRatio = data ? getVideoAspectRatio(data.width, data.height) : BIENVENUE_VIDEO_ASPECT_RATIO

  return (
    <YStack
      flex={1}
      minHeight={0}
      width="100%"
      {...(!fillAvailableSpace ? { aspectRatio } : undefined)}
      maxHeight={maxHeight}
      {...(isWeb ? { height: '100%' } : undefined)}
    >
      <YStack width="100%" height="100%" borderRadius="$medium" overflow="hidden" bg="$black1">
        {isLoading ? (
          <YStack width="100%" height="100%" alignItems="center" justifyContent="center">
            <Circle size={64} backgroundColor="rgba(0,0,0,0.45)" alignItems="center" justifyContent="center">
              <Spinner size="large" color="$white1" />
            </Circle>
          </YStack>
        ) : isError || !data ? (
          <YStack flex={1} width="100%" height="100%" alignItems="center" justifyContent="center" padding="$medium">
            <Text.MD secondary textAlign="center">
              La vidéo n&apos;est pas disponible pour le moment.
            </Text.MD>
          </YStack>
        ) : (
          <VideoPlayer
            hlsUrl={data.hls_url}
            thumbnailUrl={data.thumbnail_url}
            width={data.width}
            height={data.height}
            autoPlay
            loop
            active={isScreenFocused}
            controls={false}
            fill
          />
        )}
      </YStack>
    </YStack>
  )
}
