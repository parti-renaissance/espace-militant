import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import * as Location from 'expo-location'
import { Platform } from 'react-native'
import type { CameraPadding } from '@rnmapbox/maps'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'
import { FeatureCollection, Point } from 'geojson'

import MapboxGl from '@/components/Mapbox/Mapbox'

const EVENTS_MAP_STYLE_URL = 'mapbox://styles/larem/clwaph1m1008501pg1cspgbj2'

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

export type EventMapItem = {
  uuid: string
  name: string
  slug: string
  latitude: number
  longitude: number
}

export type EventMapFeatureProperties = {
  uuid: string
  name: string
  slug: string
}

export type EventMapHandle = {
  animateCameraTo: (centerCoordinate: [number, number], zoomLevel: number) => void
  centerOnMyPosition: () => Promise<void>
}

export type EventMapProps = {
  events: EventMapItem[]
  isInteractive?: boolean
  clusterEvents?: boolean
  onEventPress: (event: OnPressEvent) => void
  centerCoordinate: [number, number]
  zoomLevel: number
  padding?: CameraPadding
  /** Pour désactiver un bouton / afficher un chargement pendant la demande de géoloc. */
  onCenterOnUserLocationStateChange?: (isLocating: boolean) => void
}

const isNativePlatform = Platform.OS !== 'web'

const EventMap = forwardRef<EventMapHandle, EventMapProps>(
  ({ events, isInteractive = true, clusterEvents = false, onEventPress, centerCoordinate, zoomLevel, padding, onCenterOnUserLocationStateChange }, ref) => {
    const cameraRef = useRef<React.ComponentRef<typeof MapboxGl.Camera>>(null)

    // Sur RN, UserLocation se démonte au blur avant la vue carte pour éviter la course LocationManager / Animated (#rnmapbox)
    const [mountUserLocation, setMountUserLocation] = useState(!isNativePlatform)

    useFocusEffect(
      useCallback(() => {
        if (!isNativePlatform) {
          return undefined
        }
        setMountUserLocation(true)
        return () => setMountUserLocation(false)
      }, []),
    )

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
          console.warn("Permission de géolocalisation refusée par l'utilisateur.")
          return
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })

        const userCoords: [number, number] = [position.coords.longitude, position.coords.latitude]

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
      } finally {
        onCenterOnUserLocationStateChange?.(false)
      }
    }, [animateCameraTo, events, onCenterOnUserLocationStateChange])

    useImperativeHandle(
      ref,
      () => ({
        animateCameraTo,
        centerOnMyPosition,
      }),
      [animateCameraTo, centerOnMyPosition],
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
          },
          geometry: {
            type: 'Point',
            coordinates: [event.longitude, event.latitude],
          },
        })),
      }),
      [events],
    )

    const pointStyle = {
      circleRadius: 8,
      circleColor: '#2A7FFF',
      circleStrokeColor: '#FFFFFF',
      circleStrokeWidth: 2,
    } as const

    return (
      <MapboxGl.MapView
        key="main-events-map"
        style={{ flex: 1 }}
        styleURL={EVENTS_MAP_STYLE_URL}
        scaleBarEnabled={false}
        scrollEnabled={isInteractive}
        zoomEnabled={isInteractive}
        rotateEnabled={isInteractive}
      >
        <MapboxGl.Camera
          key="main-events-map-camera"
          ref={cameraRef}
          followUserLocation={false}
          centerCoordinate={centerCoordinate}
          zoomLevel={zoomLevel}
          padding={padding}
        />
        {mountUserLocation ? (
          <MapboxGl.UserLocation key="main-events-map-user-location" visible autoTrigger preventAutoCenterOnAutoTrigger hideNativeGeolocateButton />
        ) : null}
        {clusterEvents ? (
          <MapboxGl.ShapeSource
            id="events-map-source"
            shape={shape}
            onPress={onEventPress}
            cluster
            clusterRadius={40}
            clusterMaxZoomLevel={18}
            hitbox={{ width: 24, height: 24 }}
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
            <MapboxGl.CircleLayer id="events-map-points" filter={['!', ['has', 'point_count']]} style={pointStyle} />
          </MapboxGl.ShapeSource>
        ) : (
          <MapboxGl.ShapeSource
            id="events-map-source"
            shape={shape}
            onPress={onEventPress}
            cluster={false}
            clusterRadius={40}
            hitbox={{ width: 24, height: 24 }}
          >
            <MapboxGl.CircleLayer id="events-map-points" filter={['all']} style={pointStyle} />
          </MapboxGl.ShapeSource>
        )}
      </MapboxGl.MapView>
    )
  },
)

EventMap.displayName = 'EventMap'

export default EventMap
