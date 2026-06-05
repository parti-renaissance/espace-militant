import { useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'

import { useVideoFeedStore } from '@/features_next/video/store/videoFeedStore'

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
