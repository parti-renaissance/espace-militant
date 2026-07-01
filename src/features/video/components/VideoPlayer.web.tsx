import { useCallback, useState } from 'react'
import { Image } from 'expo-image'
import { YStack } from 'tamagui'

import { useWebVideoPlayback } from '@/features/video/hooks/useWebVideoPlayback'

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
> & {
  shouldPlay: boolean
  contentFit: 'cover' | 'contain'
  expectsAutoPlay: boolean
  isControlled: boolean
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
  contentFit,
  expectsAutoPlay,
  isControlled,
}: VideoPlayerSurfaceProps) {
  const {
    setVideoNode,
    effectiveMuted,
    isPlaying,
    showPlayIcon,
    showAutoplayUnmuteButton,
    handleTogglePlay,
    handleAutoplayUnmute,
  } = useWebVideoPlayback({
    hlsUrl,
    shouldPlay,
    muted,
    expectsAutoPlay,
    isControlled,
    onUserPlay,
    onUserPause,
  })

  return (
    <YStack flex={1} position="relative" width="100%" height="100%">
      <Image
        source={{ uri: thumbnailUrl }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
        pointerEvents="none"
      />
      <video
        ref={setVideoNode}
        controls={controls}
        playsInline
        loop={loop}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          objectFit: contentFit,
          backgroundColor: 'transparent',
          pointerEvents: controls ? 'auto' : 'none',
        }}
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
          onPress={handleTogglePlay}
          cursor="pointer"
          role="button"
          aria-label={showPlayIcon ? 'Lire la vidéo' : 'Mettre en pause'}
          hoverStyle={showPlayIcon ? { backgroundColor: 'rgba(0,0,0,0.15)' } : undefined}
          pressStyle={showPlayIcon ? { opacity: 0.9 } : undefined}
        >
          {showPlayIcon ? <VideoPlayIcon /> : null}
        </YStack>
      ) : null}
      {showMuteButton && isPlaying && onMutedChange ? (
        <VideoMuteButton muted={effectiveMuted} onPress={onMutedChange} />
      ) : showAutoplayUnmuteButton ? (
        <VideoMuteButton muted onPress={handleAutoplayUnmute} />
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
  const isControlled = onUserPlay != null || onUserPause != null
  const aspectRatio = getVideoAspectRatio(width, height)
  const contentFit: 'cover' | 'contain' = fill ? 'cover' : 'contain'

  const handleActivate = useCallback(() => {
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
      contentFit={contentFit}
      expectsAutoPlay={expectsAutoPlay}
      isControlled={isControlled}
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
          <Image
            source={{ uri: thumbnailUrl }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            contentFit="cover"
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
            backgroundColor="rgba(0,0,0,0.2)"
            onPress={handleActivate}
            cursor="pointer"
            role="button"
            aria-label="Lire la vidéo"
            hoverStyle={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
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
