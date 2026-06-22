import { useCallback, useEffect, useRef, useState } from 'react'
import { Image } from 'expo-image'
import { YStack } from 'tamagui'

import { isAutoplayPolicyError, shouldShowVideoPlayIcon } from '@/features_next/video/helpers/videoPlaybackUi'

import { getVideoAspectRatio, type VideoPlayerProps } from './VideoPlayer.types'
import { VideoMuteButton } from './VideoMuteButton'
import { VideoPlayIcon } from './VideoPlayIcon'

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

const loadHlsScript = (signal: AbortSignal): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    if (window.Hls) {
      resolve()
      return
    }
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${HLS_JS_URL}"]`)
    const script = existing ?? document.createElement('script')
    const isOwner = existing === null

    script.addEventListener('load', () => resolve(), { signal })
    script.addEventListener('error', () => reject(new Error('hls.js load failed')), { signal })

    signal.addEventListener('abort', () => {
      reject(new DOMException('Aborted', 'AbortError'))
      if (isOwner && !window.Hls) script.remove()
    })

    if (isOwner) {
      script.src = HLS_JS_URL
      script.async = true
      document.head.appendChild(script)
    }
  })

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
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [ready, setReady] = useState(false)
  const [isUserPaused, setIsUserPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoplayFailed, setAutoplayFailed] = useState(false)
  const effectiveShouldPlay = isControlled ? shouldPlay : shouldPlay && !isUserPaused

  const setVideoNode = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node
    if (!node) return

    const onPlay = () => {
      setIsPlaying(true)
      setAutoplayFailed(false)
    }
    const onPause = () => setIsPlaying(false)

    node.addEventListener('play', onPlay)
    node.addEventListener('pause', onPause)
    node.muted = muted
    setIsPlaying(!node.paused)

    return () => {
      node.removeEventListener('play', onPlay)
      node.removeEventListener('pause', onPause)
      videoRef.current = null
    }
  }, [muted])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = muted
  }, [muted])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const controller = new AbortController()
    let hls: HlsPlayer | null = null

    const setup = async () => {
      let hlsSupported = false
      try {
        await loadHlsScript(controller.signal)
        hlsSupported = !controller.signal.aborted && !!window.Hls?.isSupported()
      } catch {
        // hls.js indisponible : on tentera le fallback natif (Safari / iOS).
      }

      if (controller.signal.aborted) return

      if (hlsSupported && window.Hls) {
        hls = new window.Hls()
        hls.loadSource(hlsUrl)
        hls.attachMedia(video)
        setReady(true)
        return
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl
        setReady(true)
      }
    }

    void setup()

    return () => {
      controller.abort()
      setReady(false)
      hls?.destroy()
      hls = null
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [hlsUrl])

  useEffect(() => {
    if (!ready) return
    const video = videoRef.current
    if (!video) return

    if (effectiveShouldPlay) {
      void video.play().catch((error) => {
        if (isAutoplayPolicyError(error)) setAutoplayFailed(true)
      })
    } else {
      video.pause()
    }
  }, [effectiveShouldPlay, ready])

  const showPlayIcon = shouldShowVideoPlayIcon(
    isPlaying,
    isControlled ? !shouldPlay : isUserPaused,
    autoplayFailed && expectsAutoPlay && effectiveShouldPlay,
    isControlled ? shouldPlay : expectsAutoPlay,
  )

  const handleTogglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      if (!isControlled) setIsUserPaused(false)
      setAutoplayFailed(false)
      onUserPlay?.()
      void video.play().catch((error) => {
        if (isAutoplayPolicyError(error)) setAutoplayFailed(true)
      })
    } else {
      if (!isControlled) setIsUserPaused(true)
      onUserPause?.()
      video.pause()
    }
  }, [isControlled, onUserPause, onUserPlay])

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
