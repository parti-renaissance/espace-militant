import { useCallback, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { useVideoPlayer, VideoView } from 'expo-video'
import { YStack } from 'tamagui'

import { safePlayerAction, useExpoPlayerAutoPlayback } from '@/features/video/helpers/safePlayerPlayback'
import { shouldShowVideoPlayIcon } from '@/features/video/helpers/videoPlaybackUi'

import { getVideoAspectRatio, type VideoPlayerProps } from './VideoPlayer.types'
import { VideoMuteButton } from './VideoMuteButton'
import { VideoPlayIcon } from './VideoPlayIcon'

type VideoPlayerSurfaceProps = Pick<
  VideoPlayerProps,
  | 'hlsUrl'
  | 'thumbnailUrl'
  | 'loop'
  | 'controls'
  | 'muted'
  | 'onMutedChange'
  | 'showMuteButton'
  | 'onUserPlay'
  | 'onUserPause'
  | 'playAllowedRef'
  | 'embedded'
> & {
  shouldPlay: boolean
  contentFit: 'contain' | 'cover'
  expectsAutoPlay: boolean
}

function VideoPlayerSurface({
  hlsUrl,
  thumbnailUrl,
  loop = true,
  shouldPlay,
  controls = true,
  muted = false,
  onMutedChange,
  showMuteButton = false,
  onUserPlay,
  onUserPause,
  playAllowedRef,
  contentFit,
  expectsAutoPlay,
  embedded = false,
}: VideoPlayerSurfaceProps) {
  const player = useVideoPlayer(hlsUrl, (p) => {
    p.loop = loop
    p.muted = muted
  })
  const [isUserPaused, setIsUserPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoplayFailed, setAutoplayFailed] = useState(false)
  const isControlled = onUserPlay != null || onUserPause != null
  const effectiveShouldPlay = isControlled ? shouldPlay : shouldPlay && !isUserPaused

  useEffect(() => {
    safePlayerAction(() => {
      player.muted = muted
    })
  }, [muted, player])

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

  useExpoPlayerAutoPlayback(
    player,
    effectiveShouldPlay,
    playAllowedRef,
    handleAutoplayFailed,
    !isControlled || expectsAutoPlay,
  )

  useEffect(() => {
    if (expectsAutoPlay || !effectiveShouldPlay) return

    const tryStart = () => {
      if (player.status !== 'readyToPlay') return
      safePlayerAction(() => {
        setIsUserPaused(false)
        setAutoplayFailed(false)
        player.play()
      })
    }

    const subscription = player.addListener('statusChange', tryStart)
    if (player.status === 'readyToPlay') queueMicrotask(tryStart)
    return () => subscription.remove()
  }, [effectiveShouldPlay, expectsAutoPlay, player])

  const showPlayIcon = shouldShowVideoPlayIcon(
    isPlaying,
    isControlled ? !shouldPlay : isUserPaused,
    autoplayFailed && expectsAutoPlay && effectiveShouldPlay,
    isControlled ? shouldPlay : expectsAutoPlay || isControlled,
  )

  const handleVideoPress = useCallback(() => {
    safePlayerAction(() => {
      if (player.playing) {
        if (!isControlled) setIsUserPaused(true)
        onUserPause?.()
        player.pause()
        return
      }

      if (!isControlled) setIsUserPaused(false)
      setAutoplayFailed(false)
      onUserPlay?.()
      player.play()
    })
  }, [isControlled, onUserPause, onUserPlay, player])

  return (
    <YStack flex={1} position="relative" width="100%" height="100%">
      <Image source={{ uri: thumbnailUrl }} style={styles.thumbnailBackground} contentFit="cover" pointerEvents="none" />
      <VideoView
        style={embedded ? styles.videoEmbedded : styles.video}
        player={player}
        nativeControls={controls}
        contentFit={contentFit}
        pointerEvents={controls ? 'auto' : 'none'}
      />
      {!controls ? (
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
      ) : null}
      {showMuteButton && isPlaying && onMutedChange ? (
        <VideoMuteButton muted={muted} onPress={onMutedChange} />
      ) : null}
    </YStack>
  )
}

export default function VideoPlayer({
  hlsUrl,
  thumbnailUrl,
  width,
  height,
  loop = true,
  shouldPlay: shouldPlayProp,
  autoPlay = false,
  active = true,
  controls = true,
  muted = false,
  onMutedChange,
  showMuteButton = false,
  onUserPlay,
  onUserPause,
  playAllowedRef,
  startActivated,
  embedded = false,
  fill = false,
  rounded = true,
  containerBackgroundColor = '#000',
}: VideoPlayerProps) {
  const resolvedStartActivated = startActivated ?? autoPlay
  const [activated, setActivated] = useState(resolvedStartActivated)
  const derivedShouldPlay =
    shouldPlayProp ?? (activated && active && (autoPlay || !resolvedStartActivated))
  const expectsAutoPlay = shouldPlayProp != null ? shouldPlayProp : autoPlay
  const aspectRatio = getVideoAspectRatio(width, height)
  const contentFit = fill ? 'cover' : 'contain'

  const handlePosterPress = useCallback(() => {
    setActivated(true)
    onUserPlay?.()
  }, [onUserPlay])

  const surface = (
    <VideoPlayerSurface
      hlsUrl={hlsUrl}
      thumbnailUrl={thumbnailUrl}
      loop={loop}
      shouldPlay={derivedShouldPlay}
      controls={controls}
      muted={muted}
      onMutedChange={onMutedChange}
      showMuteButton={showMuteButton}
      onUserPlay={onUserPlay}
      onUserPause={onUserPause}
      playAllowedRef={playAllowedRef}
      contentFit={contentFit}
      expectsAutoPlay={expectsAutoPlay}
      embedded={embedded}
    />
  )

  if (embedded) {
    return surface
  }

  return (
    <YStack
      width="100%"
      borderRadius={rounded ? 8 : 0}
      overflow="hidden"
      backgroundColor={containerBackgroundColor}
      {...(fill ? { flex: 1, height: '100%' } : { style: { aspectRatio } })}
    >
      {!activated ? (
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
            onPress={handlePosterPress}
            role="button"
            aria-label="Lire la vidéo"
            pressStyle={{ opacity: 0.9 }}
          >
            <VideoPlayIcon />
          </YStack>
        </YStack>
      ) : (
        surface
      )}
    </YStack>
  )
}

const styles = StyleSheet.create({
  thumbnailBackground: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  video: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  videoEmbedded: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: 'transparent',
  },
})
