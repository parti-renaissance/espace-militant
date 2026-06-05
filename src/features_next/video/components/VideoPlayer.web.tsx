import { useCallback, useEffect, useRef, useState } from 'react'
import { Image } from 'expo-image'
import { YStack } from 'tamagui'

import { getVideoAspectRatio, type VideoPlayerProps } from './VideoPlayer.types'
import { VideoPlayIcon } from './VideoPlayIcon'
import { isAutoplayPolicyError, shouldShowVideoPlayIcon } from '@/features_next/video/helpers/videoPlaybackUi'

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

/**
 * Charge hls.js une seule fois et le réutilise (cache global via `window.Hls`).
 * Le `signal` permet :
 *  - de retirer automatiquement les listeners (option `{ signal }`),
 *  - de retirer la balise <script> du <head> si le composant est démonté
 *    avant la fin du chargement (évite de polluer le DOM inutilement).
 */
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
      // On ne retire que le script qu'on a soi-même injecté et qui n'a pas encore abouti.
      if (isOwner && !window.Hls) script.remove()
    })

    if (isOwner) {
      script.src = HLS_JS_URL
      script.async = true
      document.head.appendChild(script)
    }
  })

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
  const videoRef = useRef<HTMLVideoElement | null>(null)
  // URL effectivement activée. Si `hlsUrl` change, on repasse au poster (sauf autoPlay).
  const [activatedUrl, setActivatedUrl] = useState<string | null>(autoPlay ? hlsUrl : null)
  const [ready, setReady] = useState(false)
  const [isUserPaused, setIsUserPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoplayFailed, setAutoplayFailed] = useState(false)
  const [isStartingManually, setIsStartingManually] = useState(false)
  const pendingManualPlayRef = useRef(false)
  const isActivated = autoPlay || activatedUrl === hlsUrl
  const shouldAttemptAutoPlay = autoPlay && active && isActivated
  const aspectRatio = getVideoAspectRatio(width, height)
  const contentFit: 'cover' | 'contain' = fill ? 'cover' : 'contain'

  const playVideoElement = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    void video.play().catch((error) => {
      if (isAutoplayPolicyError(error)) {
        setAutoplayFailed(true)
        setIsStartingManually(false)
      }
    })
  }, [])

  const handleActivate = useCallback(() => {
    setActivatedUrl(hlsUrl)
    setIsStartingManually(true)
    setIsUserPaused(false)
    setAutoplayFailed(false)
    pendingManualPlayRef.current = true
    if (ready && activatedUrl === hlsUrl) {
      pendingManualPlayRef.current = false
      playVideoElement()
    }
  }, [activatedUrl, hlsUrl, ready, playVideoElement])

  const handleTogglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      setIsUserPaused(false)
      setAutoplayFailed(false)
      void video.play().catch((error) => {
        if (isAutoplayPolicyError(error)) setAutoplayFailed(true)
      })
    } else {
      setIsUserPaused(true)
      video.pause()
    }
  }, [])

  // Escape hatch : le listener vit exactement aussi longtemps que le nœud <video>.
  const setVideoNode = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node
    if (!node) return

    const onPlay = () => {
      setIsPlaying(true)
      setAutoplayFailed(false)
      setIsStartingManually(false)
    }
    const onPause = () => setIsPlaying(false)

    node.addEventListener('play', onPlay)
    node.addEventListener('pause', onPause)
    setIsPlaying(!node.paused)

    return () => {
      node.removeEventListener('play', onPlay)
      node.removeEventListener('pause', onPause)
      videoRef.current = null
    }
  }, [])

  // Cycle de vie HLS : ne dépend QUE de l'URL et de l'activation.
  // Changer `active`/play-pause ne détruit donc jamais l'instance HLS.
  useEffect(() => {
    if (!isActivated) return
    const video = videoRef.current
    if (!video) return

    const controller = new AbortController()
    let hls: HlsPlayer | null = null

    const setup = async () => {
      // Safari / iOS : HLS natif, pas besoin de hls.js.
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl
        setReady(true)
        return
      }

      try {
        await loadHlsScript(controller.signal)
      } catch {
        return
      }
      if (controller.signal.aborted || !window.Hls?.isSupported()) return

      hls = new window.Hls()
      hls.loadSource(hlsUrl)
      hls.attachMedia(video)
      setReady(true)
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
  }, [isActivated, hlsUrl])

  // Lecture manuelle : démarre dès que la source HLS est prête (tap sur le poster).
  useEffect(() => {
    if (!isActivated || !ready || !pendingManualPlayRef.current) return
    pendingManualPlayRef.current = false
    playVideoElement()
  }, [isActivated, ready, playVideoElement])

  // Play / pause déclaratif : uniquement pour l'autoplay (`autoPlay` prop).
  useEffect(() => {
    if (!isActivated || !ready) return
    const video = videoRef.current
    if (!video) return

    if (shouldAttemptAutoPlay && !isUserPaused) {
      void video.play().catch((error) => {
        if (isAutoplayPolicyError(error)) setAutoplayFailed(true)
      })
    } else if (!active || isUserPaused) {
      video.pause()
    }
  }, [active, isActivated, isUserPaused, ready, shouldAttemptAutoPlay])

  const showPlayButton = !isActivated
  const showCustomControls = isActivated && !controls
  const showPlayIcon = shouldShowVideoPlayIcon(
    isPlaying,
    isUserPaused,
    autoplayFailed && shouldAttemptAutoPlay,
    shouldAttemptAutoPlay || isStartingManually,
  )

  return (
    <YStack
      width="100%"
      borderRadius={rounded ? 8 : 0}
      overflow="hidden"
      backgroundColor="#000"
      {...(fill ? { flex: 1, height: '100%' } : { style: { aspectRatio } })}
    >
      <YStack flex={1} position="relative" width="100%" height="100%">
        <Image
          source={{ uri: thumbnailUrl }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          contentFit="cover"
          pointerEvents="none"
        />
        {/* Toujours montée : la ref reste stable, aucun remount => pas de flash. */}
        <video
          ref={setVideoNode}
          controls={isActivated && controls}
          playsInline
          loop={loop}
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            objectFit: contentFit,
            backgroundColor: 'transparent',
            pointerEvents: isActivated ? 'auto' : 'none',
          }}
        />

        {/* Overlay « grand play » avant activation. */}
        {showPlayButton ? (
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
        ) : null}

        {/* Overlay play/pause custom quand les contrôles natifs sont désactivés. */}
        {showCustomControls ? (
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
      </YStack>
    </YStack>
  )
}
