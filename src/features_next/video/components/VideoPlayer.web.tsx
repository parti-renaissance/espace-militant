import { useCallback, useEffect, useRef, useState } from 'react'
import { Image } from 'expo-image'
import { Circle, YStack } from 'tamagui'
import { Play } from '@tamagui/lucide-icons'

import { getVideoAspectRatio, type VideoPlayerProps } from './VideoPlayer.types'

const HLS_JS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.7/dist/hls.min.js'

type HlsPlayer = {
  loadSource: (url: string) => void
  attachMedia: (video: HTMLVideoElement) => void
  destroy: () => void
}

declare global {
  interface Window {
    Hls?: {
      isSupported: () => boolean
      new (): HlsPlayer
    }
  }
}

const loadHlsScript = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (window.Hls) {
      resolve()
      return
    }

    const existing = document.querySelector(`script[src="${HLS_JS_URL}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('hls.js load failed')))
      return
    }

    const script = document.createElement('script')
    script.src = HLS_JS_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('hls.js load failed'))
    document.head.appendChild(script)
  })

export default function VideoPlayer({ hlsUrl, thumbnailUrl, width, height, autoPlay = false, loop = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playedHlsUrl, setPlayedHlsUrl] = useState<string | null>(autoPlay ? hlsUrl : null)
  const aspectRatio = getVideoAspectRatio(width, height)
  const showPoster = !autoPlay && playedHlsUrl !== hlsUrl
  const shouldPlay = autoPlay || playedHlsUrl === hlsUrl

  const handlePlay = useCallback(() => {
    setPlayedHlsUrl(hlsUrl)
  }, [hlsUrl])

  useEffect(() => {
    if (showPoster) return

    const video = videoRef.current
    if (!video) return

    let hlsInstance: HlsPlayer | null = null
    let cancelled = false

    const setup = async () => {
      video.loop = loop

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl
      } else {
        try {
          await loadHlsScript()
        } catch {
          return
        }

        if (cancelled || !window.Hls?.isSupported()) return

        hlsInstance = new window.Hls!()
        hlsInstance.loadSource(hlsUrl)
        hlsInstance.attachMedia(video)
      }

      if (shouldPlay) {
        await video.play().catch(() => undefined)
      }
    }

    void setup()

    return () => {
      cancelled = true
      hlsInstance?.destroy()
      video.removeAttribute('src')
      video.load()
    }
  }, [showPoster, hlsUrl, shouldPlay, loop])

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
            cursor="pointer"
            role="button"
            aria-label="Lire la vidéo"
            hoverStyle={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
            pressStyle={{ opacity: 0.9 }}
          >
            <Circle size={64} backgroundColor="rgba(255,255,255,0.95)" alignItems="center" justifyContent="center">
              <Play size={28} color="$textPrimary" fill="currentColor" marginLeft={4} />
            </Circle>
          </YStack>
        </YStack>
      ) : (
        <video
          ref={videoRef}
          controls
          playsInline
          loop={loop}
          poster={thumbnailUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            backgroundColor: '#000',
          }}
        />
      )}
    </YStack>
  )
}
