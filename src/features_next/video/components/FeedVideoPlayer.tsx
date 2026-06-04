import { useCallback, useEffect, useState } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { Image } from 'expo-image'
import { Volume2, VolumeX } from '@tamagui/lucide-icons'
import { Circle, YStack } from 'tamagui'

import { useIsContentInFeedView, useVideoFeedStore } from '@/features_next/video/store/videoFeedStore'
import { getVideoAspectRatio } from '@/features_next/video/components/VideoPlayer.types'
import { VideoPlayIcon } from '@/features_next/video/components/VideoPlayIcon'
import { safePlayerAction, useExpoPlayerAutoPlayback } from '@/features_next/video/helpers/safePlayerPlayback'

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

type FeedVideoContentProps = {
  contentId: string
  hlsUrl: string
  videoId: string
  isSlideViewable: boolean
  contentFit: 'contain' | 'cover'
}

function FeedVideoContent({ contentId, hlsUrl, videoId, isSlideViewable, contentFit }: FeedVideoContentProps) {
  const activeVideoId = useVideoFeedStore((s) => s.activeVideoId)
  const claimActiveVideo = useVideoFeedStore((s) => s.claimActiveVideo)
  const isMuted = useVideoFeedStore((s) => s.isMuted)
  const toggleMuted = useVideoFeedStore((s) => s.toggleMuted)
  const isAppActive = useVideoFeedStore((s) => s.isAppActive)

  const isPostInView = useIsContentInFeedView(contentId)
  const isFocusedPost = useVideoFeedStore((s) => s.focusedContentId === contentId)
  const isActive = activeVideoId === videoId
  const canAutoPlay = isSlideViewable && isPostInView && isFocusedPost
  const canInteract = canAutoPlay || (isActive && isPostInView && isFocusedPost)
  const shouldAutoPlay = canAutoPlay && isActive && isAppActive
  const [isUserPaused, setIsUserPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const player = useVideoPlayer(hlsUrl, (p) => {
    p.loop = true
    p.muted = true
  })

  useEffect(() => {
    safePlayerAction(() => {
      player.muted = isMuted
    })
  }, [player, isMuted])

  useEffect(() => {
    const subscription = player.addListener('playingChange', ({ isPlaying: playing }) => {
      setIsPlaying(playing)
    })
    return () => subscription.remove()
  }, [player])

  useExpoPlayerAutoPlayback(player, shouldAutoPlay && !isUserPaused)

  const handleVideoPress = useCallback(() => {
    if (!canInteract || !isAppActive) return

    safePlayerAction(() => {
      if (player.playing) {
        setIsUserPaused(true)
        player.pause()
        return
      }

      setIsUserPaused(false)
      claimActiveVideo(contentId, videoId)
      player.play()
    })
  }, [canInteract, claimActiveVideo, contentId, isAppActive, player, videoId])

  const handleToggleMute = useCallback(() => {
    toggleMuted()
  }, [toggleMuted])

  const MuteIcon = isMuted ? VolumeX : Volume2

  return (
    <YStack flex={1} position="relative" width="100%" height="100%">
      <VideoView style={styles.video} player={player} nativeControls={false} contentFit={contentFit} />
      <YStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        alignItems="center"
        justifyContent="center"
        onPress={handleVideoPress}
        role="button"
        aria-label={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
        pressStyle={isPlaying ? undefined : { opacity: 0.9 }}
      >
        {!isPlaying ? <VideoPlayIcon /> : null}
      </YStack>
      <YStack
        position="absolute"
        bottom={12}
        right={12}
        zIndex={10}
        onPress={handleToggleMute}
        onMouseDown={Platform.OS === 'web' ? (event) => event.preventDefault() : undefined}
        role="button"
        aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
        pressStyle={{ opacity: 0.85 }}
        cursor="pointer"
      >
        <Circle size={36} backgroundColor="rgba(0,0,0,0.55)" alignItems="center" justifyContent="center">
          <MuteIcon size={18} color="white" />
        </Circle>
      </YStack>
    </YStack>
  )
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
  const contentFit = fill ? 'cover' : 'contain'
  const isAppActive = useVideoFeedStore((s) => s.isAppActive)
  const activeVideoId = useVideoFeedStore((s) => s.activeVideoId)
  const claimActiveVideo = useVideoFeedStore((s) => s.claimActiveVideo)
  const isPostInView = useIsContentInFeedView(contentId)
  const isFocusedPost = useVideoFeedStore((s) => s.focusedContentId === contentId)
  const isActiveVideo = activeVideoId === videoId
  const shouldMountPlayer = isPostInView && isFocusedPost && isActiveVideo && isAppActive

  const handleThumbnailPress = useCallback(() => {
    if (!isPostInView || !isAppActive) return
    claimActiveVideo(contentId, videoId)
  }, [claimActiveVideo, contentId, isAppActive, isPostInView, videoId])

  return (
    <YStack
      width="100%"
      borderRadius={rounded ? 8 : 0}
      overflow="hidden"
      backgroundColor="#000"
      {...(fill ? { flex: 1, height: '100%' } : { style: { aspectRatio } })}
    >
      {shouldMountPlayer ? (
        <FeedVideoContent
          key={videoId}
          contentId={contentId}
          hlsUrl={hlsUrl}
          videoId={videoId}
          isSlideViewable={isSlideViewable}
          contentFit={contentFit}
        />
      ) : (
        <YStack flex={1} position="relative" width="100%" height="100%">
          <Image source={{ uri: thumbnailUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          <YStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            alignItems="center"
            justifyContent="center"
            backgroundColor="rgba(0,0,0,0.2)"
            onPress={handleThumbnailPress}
            role="button"
            aria-label="Lire la vidéo"
            pressStyle={{ opacity: 0.9 }}
          >
            <VideoPlayIcon />
          </YStack>
        </YStack>
      )}
    </YStack>
  )
}

const styles = StyleSheet.create({
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
})
