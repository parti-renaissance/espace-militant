import { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { Image } from 'expo-image'
import { YStack } from 'tamagui'

import { safePlayerAction, useExpoPlayerAutoPlayback } from '@/features_next/video/helpers/safePlayerPlayback'
import { shouldShowVideoPlayIcon } from '@/features_next/video/helpers/videoPlaybackUi'

import { getVideoAspectRatio, type VideoPlayerProps } from './VideoPlayer.types'
import { VideoPlayIcon } from './VideoPlayIcon'

type NativeVideoContentProps = {
  hlsUrl: string
  thumbnailUrl: string
  loop: boolean
  autoPlay: boolean
  /** Lecture demandée par un tap sur le poster (autoPlay=false). */
  startOnMount: boolean
  active: boolean
  controls: boolean
  contentFit: 'contain' | 'cover'
}

function NativeVideoContent({ hlsUrl, thumbnailUrl, loop, autoPlay, startOnMount, active, controls, contentFit }: NativeVideoContentProps) {
  const player = useVideoPlayer(hlsUrl, (p) => {
    p.loop = loop
  })
  const [isUserPaused, setIsUserPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoplayFailed, setAutoplayFailed] = useState(false)
  const shouldAttemptAutoPlay = autoPlay && active

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
    shouldAttemptAutoPlay && !isUserPaused,
    undefined,
    handleAutoplayFailed,
    autoPlay,
  )

  const pendingManualStartRef = useRef(startOnMount)

  useEffect(() => {
    pendingManualStartRef.current = startOnMount
  }, [startOnMount])

  useEffect(() => {
    if (!startOnMount || !active) return

    const tryStart = () => {
      if (!pendingManualStartRef.current || player.status !== 'readyToPlay') return
      pendingManualStartRef.current = false
      safePlayerAction(() => {
        setIsUserPaused(false)
        setAutoplayFailed(false)
        player.play()
      })
    }

    const subscription = player.addListener('statusChange', tryStart)
    if (player.status === 'readyToPlay') queueMicrotask(tryStart)
    return () => subscription.remove()
  }, [active, player, startOnMount])

  const showPlayIcon = shouldShowVideoPlayIcon(
    isPlaying,
    isUserPaused,
    autoplayFailed && shouldAttemptAutoPlay,
    shouldAttemptAutoPlay || startOnMount,
  )

  const handleVideoPress = useCallback(() => {
    safePlayerAction(() => {
      if (player.playing) {
        setIsUserPaused(true)
        player.pause()
      } else {
        setIsUserPaused(false)
        setAutoplayFailed(false)
        player.play()
      }
    })
  }, [player])

  return (
    <YStack flex={1} position="relative" width="100%" height="100%">
      <Image source={{ uri: thumbnailUrl }} style={styles.thumbnailBackground} contentFit="cover" pointerEvents="none" />
      <VideoView
        style={styles.video}
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
    </YStack>
  )
}

export default function VideoPlayer({
  hlsUrl,
  thumbnailUrl,
  width,
  height,
  autoPlay = false,
  loop = true,
  active = true,
  controls = true,
  fill = false,
  rounded = true,
}: VideoPlayerProps) {
  const [playedHlsUrl, setPlayedHlsUrl] = useState<string | null>(autoPlay ? hlsUrl : null)
  const aspectRatio = getVideoAspectRatio(width, height)
  const showPoster = !autoPlay && playedHlsUrl !== hlsUrl
  const shouldPlay = autoPlay || playedHlsUrl === hlsUrl

  const contentFit = fill ? 'cover' : 'contain'

  const handlePlay = useCallback(() => {
    setPlayedHlsUrl(hlsUrl)
  }, [hlsUrl])

  return (
    <YStack
      width="100%"
      borderRadius={rounded ? 8 : 0}
      overflow="hidden"
      backgroundColor="#000"
      {...(fill ? { flex: 1, height: '100%' } : { style: { aspectRatio } })}
    >
      {showPoster ? (
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
            onPress={handlePlay}
            role="button"
            aria-label="Lire la vidéo"
            pressStyle={{ opacity: 0.9 }}
          >
            <VideoPlayIcon />
          </YStack>
        </YStack>
      ) : (
        <NativeVideoContent
          hlsUrl={hlsUrl}
          thumbnailUrl={thumbnailUrl}
          loop={loop}
          autoPlay={autoPlay}
          startOnMount={!autoPlay && shouldPlay}
          active={active}
          controls={controls}
          contentFit={contentFit}
        />
      )}
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
