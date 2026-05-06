import React, { ComponentRef, useCallback, useMemo, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { isWeb, Spinner, useMedia, XStack, YStack } from 'tamagui'
import { ArrowLeft, Crosshair } from '@tamagui/lucide-icons'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'
import { FeatureCollection, Point } from 'geojson'

import Layout from '@/components/AppStructure/Layout/Layout'
import { SideBarArea } from '@/components/AppStructure/Navigation/SideBar'
import { VoxButton } from '@/components/Button'
import MapboxGl from '@/components/Mapbox/Mapbox'

import clientEnv from '@/config/clientEnv'
import { useSuspensePaginatedEvents } from '@/services/events/hook'

MapboxGl.setAccessToken(clientEnv.MAP_BOX_ACCESS_TOKEN)

type EventMapFeatureProperties = {
  uuid: string
  name: string
  slug: string
}

const DEFAULT_CENTER: [number, number] = [2.45, 46.55]
const isFiniteCoordinate = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)

const toRadians = (x: number) => (x * Math.PI) / 180

const distanceInKm = (from: [number, number], to: [number, number]) => {
  const earthRadiusKm = 6371
  const dLat = toRadians(to[1] - from[1])
  const dLon = toRadians(to[0] - from[0])
  const lat1 = toRadians(from[1])
  const lat2 = toRadians(to[1])
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a))
}

const getZoomForNearestDistance = (distanceKm: number) => {
  if (distanceKm <= 1.5) return 14
  if (distanceKm <= 3) return 13
  if (distanceKm <= 6) return 12
  if (distanceKm <= 12) return 11
  if (distanceKm <= 25) return 10
  if (distanceKm <= 50) return 9.2
  return 6.5
}

const EventsMapPage = () => {
  const router = useRouter()
  // 1. On remplace les state par une référence sur la caméra
  const cameraRef = useRef<ComponentRef<typeof MapboxGl.Camera>>(null)
  const [isLocating, setIsLocating] = useState(false)
  const media = useMedia()
  const insets = useSafeAreaInsets()
  const cameraPadding = useMemo(
    () => ({
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      // Sur mobile, il n'y a pas (ou pas autant) d'UI latérale: un paddingLeft trop grand décale la vue.
      paddingLeft: media.sm ? 0 : 230,
    }),
    [media.sm],
  )

  const cameraZoomLevel = useMemo(() => {
    // Ajuste le "zoom de base" pour que la France reste bien visible sur petits écrans.
    if (media.xs) return 4.3
    if (media.sm) return 4.6
    return 5.5
  }, [media.sm, media.xs])

  const { data, isLoading, isFetching } = useSuspensePaginatedEvents({
    filters: {},
  })

  const mapEvents = useMemo(() => {
    const items = data?.pages.flatMap((page) => page.items) ?? []
    return items.filter((event) => isFiniteCoordinate(event.post_address?.latitude) && isFiniteCoordinate(event.post_address?.longitude)).slice(0, 20)
  }, [data?.pages])

  const shape = useMemo<FeatureCollection<Point, EventMapFeatureProperties>>(
    () => ({
      type: 'FeatureCollection',
      features: mapEvents.map((event) => ({
        type: 'Feature',
        properties: {
          uuid: event.uuid,
          name: event.name,
          slug: event.slug,
        },
        geometry: {
          type: 'Point',
          coordinates: [event.post_address!.longitude!, event.post_address!.latitude!],
        },
      })),
    }),
    [mapEvents],
  )

  const handleEventPress = (event: OnPressEvent) => {
    const firstFeature = event.features?.[0]
    const slug = firstFeature?.properties?.slug
    if (typeof slug === 'string' && slug.length > 0) {
      router.push(`/evenements/${slug}`)
    }
  }

  const handleCenterOnMyPosition = useCallback(async () => {
    // Fonction d'animation encapsulée
    const animateCameraTo = (center: [number, number], zoom: number) => {
      const camera = cameraRef.current
      if (!camera) return

      camera.setCamera({
        centerCoordinate: center,
        zoomLevel: zoom,
        animationDuration: 1500,
        animationMode: 'flyTo',
      })
    }

    try {
      setIsLocating(true)

      // 1. Demande de permission unifiée (Web, iOS, Android)
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.warn("Permission de géolocalisation refusée par l'utilisateur.")
        return
      }

      // 2. Récupération de la position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Suffisant pour centrer la carte sans vider la batterie
      })

      const userCoords: [number, number] = [position.coords.longitude, position.coords.latitude]

      // 3. Logique de calcul (inchangée)
      if (mapEvents.length === 0) {
        animateCameraTo(userCoords, 12)
        return
      }

      const eventCoordinates = mapEvents.map((event) => [event.post_address!.longitude!, event.post_address!.latitude!] as [number, number])
      const nearestEvent = eventCoordinates.reduce(
        (acc, coords) => {
          const distanceKm = distanceInKm(userCoords, coords)
          if (distanceKm < acc.distanceKm) {
            return { coords, distanceKm }
          }
          return acc
        },
        { coords: eventCoordinates[0], distanceKm: Number.POSITIVE_INFINITY },
      )

      const nextCenter: [number, number] =
        nearestEvent.distanceKm > 10 ? [(userCoords[0] + nearestEvent.coords[0]) / 2, (userCoords[1] + nearestEvent.coords[1]) / 2] : userCoords

      const zoom = getZoomForNearestDistance(nearestEvent.distanceKm)

      // 4. Déclenchement de l'animation
      animateCameraTo(nextCenter, zoom)
    } catch (error) {
      console.error('Erreur lors de la récupération de la position :', error)
    } finally {
      setIsLocating(false) // Quoi qu'il arrive (succès ou échec), on retire l'état de chargement
    }
  }, [mapEvents])

  const handleBack = () => {
    if (isWeb) {
      router.push('/evenements')
    } else if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/evenements')
    }
  }

  return (
    <Layout.Main width="100%" maxWidth="100%" height="100%">
      <YStack flex={1}>
        <XStack position="absolute" top="$medium" pt={insets.top} left="$medium" zIndex={20}>
          {media.gtSm ? <SideBarArea state="militant" /> : null}
          <VoxButton variant="soft" size="lg" shrink iconLeft={ArrowLeft} theme="gray" bg="$white1" onPress={handleBack} aria-label="Retour " />
        </XStack>
        <YStack position="absolute" top="$medium" pt={insets.top} right="$medium" zIndex={20}>
          <VoxButton
            variant="soft"
            size="lg"
            shrink
            iconLeft={Crosshair}
            theme="gray"
            bg="$white1"
            onPress={handleCenterOnMyPosition}
            aria-label="Centrer sur ma position"
            disabled={isLocating}
          />
        </YStack>
        <MapboxGl.MapView key="main-events-map" style={{ flex: 1 }} styleURL="mapbox://styles/larem/clwaph1m1008501pg1cspgbj2" scaleBarEnabled={false}>
          <MapboxGl.Camera
            key="main-events-map-camera"
            ref={cameraRef}
            followUserLocation={false}
            // On utilise les props que ton wrapper WEB comprend
            centerCoordinate={DEFAULT_CENTER}
            zoomLevel={cameraZoomLevel}
            padding={cameraPadding}
          />
          <MapboxGl.UserLocation key="main-events-map-user-location" visible autoTrigger preventAutoCenterOnAutoTrigger hideNativeGeolocateButton />
          <MapboxGl.ShapeSource id="events-map-source" shape={shape} onPress={handleEventPress} cluster={false} clusterRadius={40}>
            <MapboxGl.CircleLayer
              id="events-map-points"
              filter={['all']}
              style={{
                circleRadius: 8,
                circleColor: '#2A7FFF',
                circleStrokeColor: '#FFFFFF',
                circleStrokeWidth: 2,
              }}
            />
          </MapboxGl.ShapeSource>
        </MapboxGl.MapView>
        {(isLoading || isFetching) && (
          <YStack position="absolute" right={0} bottom={0} pointerEvents="none">
            <Spinner size="large" />
          </YStack>
        )}
      </YStack>
    </Layout.Main>
  )
}

export default EventsMapPage
