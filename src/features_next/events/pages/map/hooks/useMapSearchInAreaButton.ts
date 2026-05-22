import { useCallback, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import {
  MAP_IDLE_DEBOUNCE_MS,
  type MapCameraSnapshot,
  shouldShowSearchInThisAreaButton,
} from '../utils/mapSearchArea'

export const useMapSearchInAreaButton = (initialLastSearch: MapCameraSnapshot) => {
  const [isVisible, setIsVisible] = useState(false)
  const lastSearchRef = useRef(initialLastSearch)
  const suppressNextIdleRef = useRef(false)
  const hasSyncedInitialCameraRef = useRef(false)

  const commitSearch = useCallback((snapshot: MapCameraSnapshot) => {
    lastSearchRef.current = snapshot
    setIsVisible(false)
  }, [])

  const suppressNextIdle = useCallback(() => {
    suppressNextIdleRef.current = true
    setIsVisible(false)
  }, [])

  const evaluateMapIdle = useCallback((snapshot: MapCameraSnapshot) => {
    if (suppressNextIdleRef.current) {
      suppressNextIdleRef.current = false
      return
    }

    if (!hasSyncedInitialCameraRef.current) {
      hasSyncedInitialCameraRef.current = true
      lastSearchRef.current = snapshot
      return
    }

    setIsVisible(shouldShowSearchInThisAreaButton(snapshot, lastSearchRef.current))
  }, [])

  const handleMapIdle = useDebouncedCallback(evaluateMapIdle, MAP_IDLE_DEBOUNCE_MS, {
    leading: false,
    trailing: true,
  })

  return {
    isVisible,
    handleMapIdle,
    commitSearch,
    suppressNextIdle,
  }
}
