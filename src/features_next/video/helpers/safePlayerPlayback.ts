import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { Platform } from 'react-native'
import type { VideoPlayer } from 'expo-video'

import { isAutoplayPolicyError } from '@/features_next/video/helpers/videoPlaybackUi'

let playAbortHandlerInstalled = false

/** Web: expo-video calls `video.play()` without catching AbortError when pause() races play(). */
const installPlayAbortErrorHandler = () => {
  if (playAbortHandlerInstalled || Platform.OS !== 'web' || typeof window === 'undefined') return
  playAbortHandlerInstalled = true

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    if (reason instanceof DOMException && reason.name === 'AbortError') {
      event.preventDefault()
    }
  })
}

export function safePlayerAction(action: () => void) {
  try {
    action()
  } catch {
    // Player natif déjà libéré au démontage (expo-video).
  }
}

const runPlayerPlay = (player: VideoPlayer, onAutoplayFailed?: () => void) => {
  const result = player.play() as void | Promise<void>
  if (Platform.OS === 'web' && result != null && typeof (result as Promise<void>).then === 'function') {
    void (result as Promise<void>).catch((error) => {
      if (isAutoplayPolicyError(error)) {
        onAutoplayFailed?.()
      }
    })
  }
}

/**
 * Applies play/pause from a React effect without racing play() and pause() on web
 * (cancels a deferred play when the effect cleans up).
 */
export function useExpoPlayerAutoPlayback(
  player: VideoPlayer,
  shouldPlay: boolean,
  /** Mis à jour en synchrone (ex. pause utilisateur) pour éviter un play() différé après pause. */
  playAllowedRef?: RefObject<boolean>,
  /** Web: appelé si `play()` est rejeté par la politique autoplay du navigateur. */
  onAutoplayFailed?: () => void,
  /** Quand false, ne force pas pause() si shouldPlay est false (lecture manuelle). */
  pauseWhenStopped = true,
) {
  const shouldPlayRef = useRef(shouldPlay)
  const onAutoplayFailedRef = useRef(onAutoplayFailed)

  useLayoutEffect(() => {
    shouldPlayRef.current = shouldPlay
    if (playAllowedRef) playAllowedRef.current = shouldPlay
  }, [playAllowedRef, shouldPlay])

  useLayoutEffect(() => {
    onAutoplayFailedRef.current = onAutoplayFailed
  }, [onAutoplayFailed])

  useEffect(() => {
    installPlayAbortErrorHandler()

    if (!shouldPlay) {
      if (pauseWhenStopped) safePlayerAction(() => player.pause())
      return
    }

    let cancelled = false
    let playFrame: number | null = null

    const play = () => {
      const allowed = playAllowedRef?.current ?? shouldPlayRef.current
      if (!cancelled && allowed) {
        safePlayerAction(() => runPlayerPlay(player, () => {
          if (!cancelled) onAutoplayFailedRef.current?.()
        }))
      }
    }

    if (Platform.OS === 'web') {
      playFrame = requestAnimationFrame(play)
    } else {
      play()
    }

    return () => {
      cancelled = true
      if (playFrame != null) cancelAnimationFrame(playFrame)
    }
  }, [pauseWhenStopped, player, playAllowedRef, shouldPlay])

  useEffect(() => {
    return () => safePlayerAction(() => player.pause())
  }, [player])
}
