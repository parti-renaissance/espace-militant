import { useCallback, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { Image } from 'expo-image'
import { Circle, YStack } from 'tamagui'
import { Play } from '@tamagui/lucide-icons'

import { getVideoAspectRatio, type VideoPlayerProps } from './VideoPlayer.types'

function safePlayerAction(action: () => void) {
  try {
    action()
  } catch {
    // Player natif déjà libéré au démontage (expo-video).
  }
}

type NativeVideoContentProps = {
  hlsUrl: string
  loop: boolean
  shouldPlay: boolean
  active: boolean
  controls: boolean
  contentFit: 'contain' | 'cover'
}

function NativeVideoContent({ hlsUrl, loop, shouldPlay, active, controls, contentFit }: NativeVideoContentProps) {
  const player = useVideoPlayer(hlsUrl, (p) => {
    p.loop = loop
  })
  const [isPlaying, setIsPlaying] = useState(shouldPlay && active)

  useEffect(() => {
    if (shouldPlay && active) {
      safePlayerAction(() => player.play())
    } else {
      safePlayerAction(() => player.pause())
    }
  }, [player, shouldPlay, active])

  useEffect(() => {
    const subscription = player.addListener('playingChange', ({ isPlaying: playing }) => {
      setIsPlaying(playing)
    })
    return () => subscription.remove()
  }, [player])

  const handleVideoPress = useCallback(() => {
    safePlayerAction(() => {
      if (player.playing) {
        player.pause()
      } else {
        player.play()
      }
    })
  }, [player])

  return (
    <YStack flex={1} position="relative" width="100%" height="100%">
      <VideoView
        style={styles.video}
        player={player}
        nativeControls={controls}
        contentFit={contentFit}
      />
      {!controls ? (
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
          {!isPlaying ? (
            <Circle size={64} backgroundColor="rgba(0,0,0,0.45)" alignItems="center" justifyContent="center">
              <Play size={28} color="#fff" fill="currentColor" marginLeft={4} />
            </Circle>
          ) : null}
        </YStack>
      ) : null}
    </YStack>
  )
}

export default function VideoPlayer({ hlsUrl, thumbnailUrl, width, height, autoPlay = false, loop = true, active = true, controls = true, fill = false }: VideoPlayerProps) {
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
      borderRadius={8}
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
            <Circle size={64} backgroundColor="rgba(255,255,255,0.95)" alignItems="center" justifyContent="center">
              <Play size={28} color="$textPrimary" fill="currentColor" marginLeft={4} />
            </Circle>
          </YStack>
        </YStack>
      ) : (
        <NativeVideoContent hlsUrl={hlsUrl} loop={loop} shouldPlay={shouldPlay} active={active} controls={controls} contentFit={contentFit} />
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
