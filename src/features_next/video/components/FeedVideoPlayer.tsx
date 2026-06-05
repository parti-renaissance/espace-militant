import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { Image } from 'expo-image'
import { Volume2, VolumeX } from '@tamagui/lucide-icons'
import { Circle, YStack } from 'tamagui'

import { useIsContentInFeedView, useVideoFeedStore } from '@/features_next/video/store/videoFeedStore'
import { getVideoAspectRatio } from '@/features_next/video/components/VideoPlayer.types'
import { VideoPlayIcon } from '@/features_next/video/components/VideoPlayIcon'
import { safePlayerAction, useExpoPlayerAutoPlayback } from '@/features_next/video/helpers/safePlayerPlayback'
import { shouldShowVideoPlayIcon } from '@/features_next/video/helpers/videoPlaybackUi'

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

type FeedVideoLayerProps = {
  contentId: string
  hlsUrl: string
  videoId: string
  isSlideViewable: boolean
  contentFit: 'contain' | 'cover'
}

function FeedVideoLayer({ contentId, hlsUrl, videoId, isSlideViewable, contentFit }: FeedVideoLayerProps) {
  const activeVideoId = useVideoFeedStore((s) => s.activeVideoId)
  const claimActiveVideo = useVideoFeedStore((s) => s.claimActiveVideo)
  const isMuted = useVideoFeedStore((s) => s.isMuted)
  const toggleMuted = useVideoFeedStore((s) => s.toggleMuted)
  const isAppActive = useVideoFeedStore((s) => s.isAppActive)
  const isScreenFocused = useVideoFeedStore((s) => s.isScreenFocused)
  const canPlay = isAppActive && isScreenFocused

  const isPostInView = useIsContentInFeedView(contentId)
  const isFocusedPost = useVideoFeedStore((s) => s.focusedContentId === contentId)
  const isActive = activeVideoId === videoId
  const canAutoPlay = isSlideViewable && isPostInView && isFocusedPost
  const canInteract = canAutoPlay || (isActive && isPostInView && isFocusedPost)
  const shouldAutoPlay = canAutoPlay && isActive && canPlay
  const [isUserPaused, setIsUserPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoplayFailed, setAutoplayFailed] = useState(false)
  const autoPlayAllowedRef = useRef(shouldAutoPlay && !isUserPaused)

  useLayoutEffect(() => {
    autoPlayAllowedRef.current = shouldAutoPlay && !isUserPaused
  }, [shouldAutoPlay, isUserPaused])

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
      if (playing) setAutoplayFailed(false)
    })
    return () => subscription.remove()
  }, [player])

  const handleAutoplayFailed = useCallback(() => {
    setAutoplayFailed(true)
  }, [])

  useExpoPlayerAutoPlayback(player, shouldAutoPlay && !isUserPaused, autoPlayAllowedRef, handleAutoplayFailed)

  const showPlayIcon = shouldShowVideoPlayIcon(isPlaying, isUserPaused, autoplayFailed && shouldAutoPlay, shouldAutoPlay)

  const handleVideoPress = useCallback(() => {
    if (!canInteract || !canPlay) return

    safePlayerAction(() => {
      if (player.playing) {
        autoPlayAllowedRef.current = false
        setIsUserPaused(true)
        player.pause()
        return
      }

      autoPlayAllowedRef.current = shouldAutoPlay
      setIsUserPaused(false)
      setAutoplayFailed(false)
      claimActiveVideo(contentId, videoId)
      player.play()
    })
  }, [canInteract, canPlay, claimActiveVideo, contentId, player, shouldAutoPlay, videoId])

  const handleToggleMute = useCallback(() => {
    toggleMuted()
  }, [toggleMuted])

  const MuteIcon = isMuted ? VolumeX : Volume2

  return (
    <>
      <VideoView
        style={styles.video}
        player={player}
        nativeControls={false}
        contentFit={contentFit}
        pointerEvents="none"
      />
      <YStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={2}
        alignItems="center"
        justifyContent="center"
        onPress={handleVideoPress}
        role="button"
        aria-label={showPlayIcon ? 'Lire la vidéo' : 'Mettre en pause'}
        pressStyle={showPlayIcon ? { opacity: 0.9 } : undefined}
      >
        {showPlayIcon ? <VideoPlayIcon /> : null}
      </YStack>
      {isPlaying ? (
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
      ) : null}
    </>
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
  const isScreenFocused = useVideoFeedStore((s) => s.isScreenFocused)
  const canPlay = isAppActive && isScreenFocused
  const claimActiveVideo = useVideoFeedStore((s) => s.claimActiveVideo)
  const isPostInView = useIsContentInFeedView(contentId)
  const isFocusedPost = useVideoFeedStore((s) => s.focusedContentId === contentId)
  const viewableVideoId = useVideoFeedStore((s) => s.viewableVideoIdByContentId[contentId] ?? null)
  const isAutoPlayTarget = isPostInView && isFocusedPost && viewableVideoId === videoId
  const shouldMountPlayer = isAutoPlayTarget && canPlay
  const showManualPlayOverlay = isPostInView && !shouldMountPlayer

  const handleThumbnailPress = useCallback(() => {
    if (!isPostInView || !canPlay) return
    claimActiveVideo(contentId, videoId)
  }, [canPlay, claimActiveVideo, contentId, isPostInView, videoId])

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
          <FeedVideoLayer
            contentId={contentId}
            hlsUrl={hlsUrl}
            videoId={videoId}
            isSlideViewable={isSlideViewable}
            contentFit={contentFit}
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
            onPress={handleThumbnailPress}
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
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: 'transparent',
  },
})
