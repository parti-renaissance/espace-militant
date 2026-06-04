import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { Platform } from 'react-native'
import type { VideoPlayer } from 'expo-video'

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

/**
 * Applies play/pause from a React effect without racing play() and pause() on web
 * (cancels a deferred play when the effect cleans up).
 */
export function useExpoPlayerAutoPlayback(
  player: VideoPlayer,
  shouldPlay: boolean,
  /** Mis à jour en synchrone (ex. pause utilisateur) pour éviter un play() différé après pause. */
  playAllowedRef?: RefObject<boolean>,
) {
  const shouldPlayRef = useRef(shouldPlay)

  useLayoutEffect(() => {
    shouldPlayRef.current = shouldPlay
    if (playAllowedRef) playAllowedRef.current = shouldPlay
  }, [playAllowedRef, shouldPlay])

  useEffect(() => {
    installPlayAbortErrorHandler()

    if (!shouldPlay) {
      safePlayerAction(() => player.pause())
      return
    }

    let cancelled = false
    let playFrame: number | null = null

    const play = () => {
      const allowed = playAllowedRef?.current ?? shouldPlayRef.current
      if (!cancelled && allowed) safePlayerAction(() => player.play())
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
  }, [player, shouldPlay])

  useEffect(() => {
    return () => safePlayerAction(() => player.pause())
  }, [player])
}
