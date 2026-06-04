import { useEffect } from 'react'
import { AppState, type AppStateStatus } from 'react-native'

import { useVideoFeedStore } from '@/features_next/video/store/videoFeedStore'

/** Met en pause toutes les vidéos du feed lorsque l'app passe en arrière-plan. */
export function useVideoFeedAppState() {
  const setAppActive = useVideoFeedStore((s) => s.setAppActive)

  useEffect(() => {
    const handleChange = (nextState: AppStateStatus) => {
      setAppActive(nextState === 'active')
    }

    const subscription = AppState.addEventListener('change', handleChange)
    return () => subscription.remove()
  }, [setAppActive])
}
