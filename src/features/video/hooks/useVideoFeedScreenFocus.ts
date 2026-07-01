import { useCallback } from 'react'
import { useFocusEffect } from "expo-router/react-navigation"

import { useVideoFeedStore } from '@/features/video/store/videoFeedStore'

/** Met en pause les vidéos du feed lorsque l'écran timeline perd le focus (changement d'onglet). */
export function useVideoFeedScreenFocus() {
  const setScreenFocused = useVideoFeedStore((s) => s.setScreenFocused)
  const clearVideoFeedFocus = useVideoFeedStore((s) => s.clearVideoFeedFocus)

  useFocusEffect(
    useCallback(() => {
      setScreenFocused(true)

      return () => {
        setScreenFocused(false)
        clearVideoFeedFocus()
      }
    }, [clearVideoFeedFocus, setScreenFocused]),
  )
}
