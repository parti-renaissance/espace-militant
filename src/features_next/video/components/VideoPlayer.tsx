import { useCallback, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { Image } from 'expo-image'
import { Circle, YStack } from 'tamagui'
import { Play } from '@tamagui/lucide-icons'

import { getVideoAspectRatio, type VideoPlayerProps } from './VideoPlayer.types'

type NativeVideoContentProps = {
  hlsUrl: string
  loop: boolean
  shouldPlay: boolean
}

function NativeVideoContent({ hlsUrl, loop, shouldPlay }: NativeVideoContentProps) {
  const player = useVideoPlayer(hlsUrl, (p) => {
    p.loop = loop
  })

  useEffect(() => {
    if (shouldPlay) {
      player.play()
    }
  }, [player, shouldPlay])

  return (
    <VideoView
      style={styles.video}
      player={player}
      nativeControls
      contentFit="contain"
    />
  )
}

export default function VideoPlayer({ hlsUrl, thumbnailUrl, width, height, autoPlay = false, loop = true }: VideoPlayerProps) {
  const [playedHlsUrl, setPlayedHlsUrl] = useState<string | null>(autoPlay ? hlsUrl : null)
  const aspectRatio = getVideoAspectRatio(width, height)
  const showPoster = !autoPlay && playedHlsUrl !== hlsUrl
  const shouldPlay = autoPlay || playedHlsUrl === hlsUrl

  const handlePlay = useCallback(() => {
    setPlayedHlsUrl(hlsUrl)
  }, [hlsUrl])

  return (
    <YStack width="100%" borderRadius={8} overflow="hidden" backgroundColor="#000" style={{ aspectRatio }}>
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
        <NativeVideoContent hlsUrl={hlsUrl} loop={loop} shouldPlay={shouldPlay} />
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
