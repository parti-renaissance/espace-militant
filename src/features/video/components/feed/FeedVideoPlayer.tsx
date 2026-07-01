import { StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { YStack } from 'tamagui'

import VideoPlayer from '@/features/video/components/VideoPlayer'
import { getVideoAspectRatio } from '@/features/video/components/VideoPlayer.types'
import { VideoPlayIcon } from '@/features/video/components/VideoPlayIcon'
import { useFeedVideoOrchestration } from '@/features/video/hooks/useFeedVideoOrchestration'

export type FeedVideoPlayerProps = {
  contentId: string
  videoId: string
  hlsUrl: string
  thumbnailUrl: string
  width?: number
  height?: number
  /** La slide est visible à ≥50% dans son conteneur (FlatList / feed). */
  isSlideViewable: boolean
  fill?: boolean
  rounded?: boolean
}

export default function FeedVideoPlayer({
  contentId,
  videoId,
  hlsUrl,
  thumbnailUrl,
  width,
  height,
  isSlideViewable,
  fill = false,
  rounded = false,
}: FeedVideoPlayerProps) {
  const aspectRatio = getVideoAspectRatio(width, height)
  const {
    shouldMountPlayer,
    shouldPlay,
    showManualPlayOverlay,
    muted,
    playAllowedRef,
    onThumbnailPress,
    onUserPlay,
    onUserPause,
    onToggleMute,
  } = useFeedVideoOrchestration({ contentId, videoId, isSlideViewable })

  return (
    <YStack
      width="100%"
      borderRadius={rounded ? 8 : 0}
      overflow="hidden"
      backgroundColor="$gray2"
      {...(fill ? { flex: 1, height: '100%' } : { style: { aspectRatio } })}
    >
      <YStack flex={1} position="relative" width="100%" height="100%">
        <Image source={{ uri: thumbnailUrl }} style={styles.thumbnailBackground} contentFit="cover" pointerEvents="none" />
        {shouldMountPlayer ? (
          <VideoPlayer
            embedded
            startActivated
            hlsUrl={hlsUrl}
            thumbnailUrl={thumbnailUrl}
            loop
            shouldPlay={shouldPlay}
            controls={false}
            muted={muted}
            showMuteButton
            onMutedChange={onToggleMute}
            onUserPlay={onUserPlay}
            onUserPause={onUserPause}
            playAllowedRef={playAllowedRef}
            fill={fill}
            rounded={false}
          />
        ) : null}
        {showManualPlayOverlay ? (
          <YStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={3}
            alignItems="center"
            justifyContent="center"
            backgroundColor="rgba(0,0,0,0.2)"
            onPress={onThumbnailPress}
            role="button"
            aria-label="Lire la vidéo"
            pressStyle={{ opacity: 0.9 }}
          >
            <VideoPlayIcon />
          </YStack>
        ) : null}
      </YStack>
    </YStack>
  )
}

const styles = StyleSheet.create({
  thumbnailBackground: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
})
