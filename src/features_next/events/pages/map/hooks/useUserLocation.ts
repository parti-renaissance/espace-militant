import { useCallback, useEffect, useRef, useState } from 'react'
import * as Location from 'expo-location'

export type UserLocationCoords = [number, number]

/**
 * Source unique GPS (`expo-location`) : permission, dernière position connue (optimiste) puis fix courant.
 * `coords` = `[longitude, latitude]` ou `null` tant qu’aucune position valide.
 */
export function useUserLocation() {
  const [coords, setCoords] = useState<UserLocationCoords | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const hasRequestedBoot = useRef(false)

  const fetchCoords = useCallback(async (): Promise<UserLocationCoords | null> => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      return null
    }

    const lastKnown = await Location.getLastKnownPositionAsync({ maxAge: 120_000 }).catch(() => null)

    let optimistic: UserLocationCoords | null = null
    if (lastKnown?.coords) {
      optimistic = [lastKnown.coords.longitude, lastKnown.coords.latitude]
      setCoords(optimistic)
    }

    let lngLat: UserLocationCoords | null = null
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      lngLat = [position.coords.longitude, position.coords.latitude]
    } catch {
      if (lastKnown?.coords) {
        lngLat = [lastKnown.coords.longitude, lastKnown.coords.latitude]
      }
    }

    const resolved = lngLat ?? optimistic
    if (resolved) {
      setCoords(resolved)
    }
    return resolved
  }, [])

  const requestLocation = useCallback(async (): Promise<UserLocationCoords | null> => {
    setIsLocating(true)
    try {
      return await fetchCoords()
    } finally {
      setIsLocating(false)
    }
  }, [fetchCoords])

  useEffect(() => {
    if (hasRequestedBoot.current) {
      return
    }
    hasRequestedBoot.current = true
    void requestLocation()
  }, [requestLocation])

  return { coords, isLocating, requestLocation }
}
