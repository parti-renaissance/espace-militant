import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Linking, Platform } from 'react-native'
import * as Location from 'expo-location'

export type UserLocationCoords = [number, number]

export type RequestLocationOptions = {
  /** Affiche une alerte native (réglages ou aide) en cas d’échec sur action utilisateur. */
  showAlertOnFailure?: boolean
}

const showNativeAlert = (title: string, message: string, openSettings = true) => {
  if (Platform.OS === 'web') {
    return
  }
  if (openSettings) {
    Alert.alert(title, message, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Ouvrir les paramètres', onPress: () => Linking.openSettings() },
    ])
    return
  }
  Alert.alert(title, message, [{ text: 'OK', style: 'cancel' }])
}

const showLocationPermissionAlert = () => {
  showNativeAlert(
    'Localisation désactivée',
    "Veuillez autoriser l'accès à la localisation dans les paramètres pour vous recentrer sur la carte.",
  )
}

const showLocationUnavailableAlert = () => {
  showNativeAlert(
    'Position introuvable',
    "Impossible d'obtenir votre position. Vérifiez que les services de localisation sont activés sur votre appareil.",
  )
}

const ensureForegroundLocationPermission = async (): Promise<boolean> => {
  let permission = await Location.getForegroundPermissionsAsync()

  if (permission.status !== 'granted' && permission.canAskAgain) {
    permission = await Location.requestForegroundPermissionsAsync()
  }

  return permission.status === 'granted'
}

/**
 * Source unique GPS (`expo-location`) : permission, dernière position connue (optimiste) puis fix courant.
 * `coords` = `[longitude, latitude]` ou `null` tant qu’aucune position valide.
 */
export function useUserLocation() {
  const [coords, setCoords] = useState<UserLocationCoords | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const hasRequestedBoot = useRef(false)

  const fetchCoords = useCallback(async (options?: RequestLocationOptions): Promise<UserLocationCoords | null> => {
    const showAlertOnFailure = Boolean(options?.showAlertOnFailure)
    const hasPermission = await ensureForegroundLocationPermission()

    if (!hasPermission) {
      if (showAlertOnFailure) {
        showLocationPermissionAlert()
      }
      return null
    }

    const servicesEnabled = await Location.hasServicesEnabledAsync()
    if (!servicesEnabled) {
      if (showAlertOnFailure) {
        showLocationPermissionAlert()
      }
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
      return resolved
    }

    if (showAlertOnFailure) {
      showLocationUnavailableAlert()
    }
    return null
  }, [])

  const requestLocation = useCallback(async (options?: RequestLocationOptions): Promise<UserLocationCoords | null> => {
    setIsLocating(true)
    try {
      return await fetchCoords(options)
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
