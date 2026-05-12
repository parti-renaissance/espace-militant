import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import * as Location from 'expo-location'
import { useToastController } from '@tamagui/toast'
import type { CameraPadding } from '@rnmapbox/maps'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'
import { FeatureCollection, Point, type Position as GeoPosition } from 'geojson'

import MapboxGl from '@/components/Mapbox/Mapbox'

import type { RestItemEvent } from '@/services/events/schema'

export type EventMapInitialBounds = { ne: [number, number]; sw: [number, number] }

/** Cadre caméra initial (source de vérité). */
export const FRANCE_METRO_CAMERA_BOUNDS: EventMapInitialBounds = {
  ne: [9.7, 51.6],
  sw: [-6.2, 40.3],
}

const EVENTS_MAP_STYLE_URL = 'mapbox://styles/larem/clwaph1m1008501pg1cspgbj2'

/** Fallback caméra si `centerCoordinate` / `zoomLevel` absents (ex. props partielles). */
const DEFAULT_CENTER: [number, number] = [2.45, 46.55]

const EVENT_PIN_MARKERS_IMAGES = {
  'pin-event-past': require('./assets/event-past.png'),
  'pin-event-militants': require('./assets/event-militants.png'),
  'pin-event-adherents': require('./assets/event-adherents.png'),
  'pin-event-invitation': require('./assets/event-invitation.png'),
} as const

export type EventMapPinImageKey = keyof typeof EVENT_PIN_MARKERS_IMAGES

type EventPinResolverInput = {
  visibility: RestItemEvent['visibility']
  isPast: boolean
}

const resolveEventMapPinImageKey = (item: EventPinResolverInput): EventMapPinImageKey => {
  if (item.isPast) {
    return 'pin-event-past'
  }

  switch (item.visibility) {
    case 'invitation':
      return 'pin-event-invitation'
    case 'adherent':
    case 'adherent_dues':
      return 'pin-event-adherents'
    default:
      return 'pin-event-militants'
  }
}

/** Raster réel des PNG (points) pour caler une cible UI ~48×53 px sous `iconSize` homogène. */
const EVENT_PIN_IMAGE_RASTER_WIDTH = 104
const EVENT_PIN_IMAGE_RASTER_HEIGHT = 114
const EVENT_PIN_ICON_SIZE = Math.min(48 / EVENT_PIN_IMAGE_RASTER_WIDTH, 53 / EVENT_PIN_IMAGE_RASTER_HEIGHT)

const EVENT_POINT_SYMBOL_STYLE = {
  iconImage: ['get', 'pinImageId'],
  iconSize: EVENT_PIN_ICON_SIZE,
  iconAllowOverlap: true,
  iconIgnorePlacement: true,
  iconAnchor: 'bottom' as const,
} as const

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

/** ~11 m à l’équateur ; suffisant pour clés requête / stabilité cache. */
const VISIBLE_BOUNDS_LNGLAT_DECIMALS = 4

/** Arrondi position utilisateur avant `onUserLocationResolved` → clés React Query stables, moins d’appels API si le GPS fluctue. */
const USER_LOCATION_COORD_DECIMALS = 4

const roundUserCoordinate = (value: number) => {
  const f = 10 ** USER_LOCATION_COORD_DECIMALS
  return Math.round(value * f) / f
}

const roundLngLat = (p: GeoPosition): GeoPosition => {
  const f = 10 ** VISIBLE_BOUNDS_LNGLAT_DECIMALS
  return [Math.round(p[0] * f) / f, Math.round(p[1] * f) / f] as GeoPosition
}

export type EventMapItem = {
  uuid: string
  name: string
  slug: string
  latitude: number
  longitude: number
  visibility: RestItemEvent['visibility']
  isPast: boolean
}

export type EventMapFeatureProperties = {
  uuid: string
  name: string
  slug: string
  pinImageId: EventMapPinImageKey
}

export type EventMapHandle = {
  animateCameraTo: (centerCoordinate: [number, number], zoomLevel: number) => void
  centerOnMyPosition: () => Promise<void>
  getVisibleBounds: () => Promise<[GeoPosition, GeoPosition]>
}

type EventMapSharedProps = {
  events: EventMapItem[]
  isInteractive?: boolean
  clusterEvents?: boolean
  onEventPress: (event: OnPressEvent) => void
  padding?: CameraPadding
  /** Pour désactiver un bouton / afficher un chargement pendant la demande de géoloc. */
  onCenterOnUserLocationStateChange?: (isLocating: boolean) => void
  /** Après obtention de la position (permission accordée) — ex. requête API avec `lat`/`lng`. */
  onUserLocationResolved?: (coords: { lat: number; lng: number }) => void
}

export type EventMapProps =
  | (EventMapSharedProps & {
      /** Vue de départ : cadrer ce rectangle (remplace center + zoom). */
      initialBounds: EventMapInitialBounds
      centerCoordinate?: [number, number]
      zoomLevel?: number
    })
  | (EventMapSharedProps & {
      initialBounds?: undefined
      centerCoordinate: [number, number]
      zoomLevel: number
    })

const EventMap = forwardRef<EventMapHandle, EventMapProps>(
  (
    {
      events,
      isInteractive = true,
      clusterEvents = false,
      onEventPress,
      initialBounds,
      centerCoordinate,
      zoomLevel,
      padding,
      onCenterOnUserLocationStateChange,
      onUserLocationResolved,
    },
    ref,
  ) => {
    const toast = useToastController()
    const cameraRef = useRef<React.ComponentRef<typeof MapboxGl.Camera>>(null)
    const mapViewRef = useRef<React.ComponentRef<typeof MapboxGl.MapView>>(null)

    const animateCameraTo = useCallback((coord: [number, number], z: number) => {
      cameraRef.current?.setCamera({
        centerCoordinate: coord,
        zoomLevel: z,
        animationDuration: 1500,
        animationMode: 'flyTo',
      })
    }, [])

    const centerOnMyPosition = useCallback(async () => {
      try {
        onCenterOnUserLocationStateChange?.(true)

        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          toast.show('Géolocalisation', {
            message: 'Autorisez l’accès à la position pour utiliser « Recentrer ».',
            type: 'warning',
          })
          return
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })

        const userCoords: [number, number] = [position.coords.longitude, position.coords.latitude]

        onUserLocationResolved?.({
          lat: roundUserCoordinate(position.coords.latitude),
          lng: roundUserCoordinate(position.coords.longitude),
        })

        if (events.length === 0) {
          animateCameraTo(userCoords, 12)
          return
        }

        const eventCoordinates = events.map((event) => [event.longitude, event.latitude] as [number, number])
        const nearestEvent = eventCoordinates.reduce(
          (acc, coords) => {
            const km = distanceInKm(userCoords, coords)
            if (km < acc.distanceKm) {
              return { coords, distanceKm: km }
            }
            return acc
          },
          { coords: eventCoordinates[0], distanceKm: Number.POSITIVE_INFINITY },
        )

        const nextCenter: [number, number] =
          nearestEvent.distanceKm > 10 ? [(userCoords[0] + nearestEvent.coords[0]) / 2, (userCoords[1] + nearestEvent.coords[1]) / 2] : userCoords

        const zoom = getZoomForNearestDistance(nearestEvent.distanceKm)
        animateCameraTo(nextCenter, zoom)
      } catch (error) {
        console.error('Erreur lors de la récupération de la position :', error)
        toast.show('Géolocalisation', {
          message: 'Impossible d’obtenir votre position. Réessayez dans un instant.',
          type: 'error',
        })
      } finally {
        onCenterOnUserLocationStateChange?.(false)
      }
    }, [animateCameraTo, events, onCenterOnUserLocationStateChange, onUserLocationResolved, toast])

    const getVisibleBounds = useCallback(() => {
      const map = mapViewRef.current
      if (!map) {
        return Promise.reject(new Error('EventMap: MapView is not mounted'))
      }
      return map.getVisibleBounds().then(([ne, sw]) => [roundLngLat(ne), roundLngLat(sw)] as [GeoPosition, GeoPosition])
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        animateCameraTo,
        centerOnMyPosition,
        getVisibleBounds,
      }),
      [animateCameraTo, centerOnMyPosition, getVisibleBounds],
    )

    const shape = useMemo<FeatureCollection<Point, EventMapFeatureProperties>>(
      () => ({
        type: 'FeatureCollection',
        features: events.map((event) => ({
          type: 'Feature',
          properties: {
            uuid: event.uuid,
            name: event.name,
            slug: event.slug,
            pinImageId: resolveEventMapPinImageKey(event),
          },
          geometry: {
            type: 'Point',
            coordinates: [event.longitude, event.latitude],
          },
        })),
      }),
      [events],
    )

    const cameraProps = initialBounds ? { bounds: initialBounds } : { centerCoordinate: centerCoordinate ?? DEFAULT_CENTER, zoomLevel: zoomLevel ?? 10 }

    return (
      <MapboxGl.MapView
        ref={mapViewRef}
        style={{ flex: 1 }}
        styleURL={EVENTS_MAP_STYLE_URL}
        scaleBarEnabled={false}
        scrollEnabled={isInteractive}
        zoomEnabled={isInteractive}
        rotateEnabled={isInteractive}
      >
        <MapboxGl.Camera ref={cameraRef} followUserLocation={false} padding={padding} {...cameraProps} />
        <MapboxGl.UserLocation visible animated={false} autoTrigger preventAutoCenterOnAutoTrigger hideNativeGeolocateButton />
        <MapboxGl.Images images={EVENT_PIN_MARKERS_IMAGES} />
        {clusterEvents ? (
          <MapboxGl.ShapeSource
            id="events-map-source"
            shape={shape}
            onPress={onEventPress}
            cluster
            clusterRadius={40}
            clusterMaxZoomLevel={18}
            hitbox={{ width: 52, height: 58 }}
          >
            <MapboxGl.CircleLayer
              id="events-map-clusters"
              filter={['has', 'point_count']}
              style={{
                circleRadius: ['step', ['get', 'point_count'], 18, 10, 22, 50, 28],
                circleColor: '#2A7FFF',
                circleStrokeColor: '#FFFFFF',
                circleStrokeWidth: 2,
                circleOpacity: 0.92,
              }}
            />
            <MapboxGl.SymbolLayer
              id="events-map-cluster-count"
              filter={['has', 'point_count']}
              style={{
                textField: ['to-string', ['get', 'point_count']],
                textSize: 14,
                textColor: '#FFFFFF',
              }}
            />
            <MapboxGl.SymbolLayer id="events-map-points" filter={['!', ['has', 'point_count']]} style={EVENT_POINT_SYMBOL_STYLE} />
          </MapboxGl.ShapeSource>
        ) : (
          <MapboxGl.ShapeSource
            id="events-map-source"
            shape={shape}
            onPress={onEventPress}
            cluster={false}
            clusterRadius={40}
            hitbox={{ width: 52, height: 58 }}
          >
            <MapboxGl.SymbolLayer id="events-map-points" filter={['all']} style={EVENT_POINT_SYMBOL_STYLE} />
          </MapboxGl.ShapeSource>
        )}
      </MapboxGl.MapView>
    )
  },
)

EventMap.displayName = 'EventMap'

export default EventMap
