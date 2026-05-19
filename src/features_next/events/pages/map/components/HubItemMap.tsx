import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import { Platform } from 'react-native'
import { YStack } from 'tamagui'
import type { CameraPadding } from '@rnmapbox/maps'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'
import { Feature, FeatureCollection, Point, type Position as GeoPosition } from 'geojson'

import MapboxGl from '@/components/Mapbox/Mapbox'
import { spreadMapCoordinates } from '@/components/Mapbox/spreadMapCoordinates'
import pinBoitage from '@/features_next/actions/assets/map/action-boitage.png'
import pinCollage from '@/features_next/actions/assets/map/action-collage.png'
import pinPap from '@/features_next/actions/assets/map/action-porte-a-porte.png'
import pinTractage from '@/features_next/actions/assets/map/action-tractage.png'
import pinEventAdherents from '@/features_next/events/assets/images/map/event-adherents.png'
import pinEventInvitation from '@/features_next/events/assets/images/map/event-invitation.png'
import pinEventMilitants from '@/features_next/events/assets/images/map/event-militants.png'
import pinEventPast from '@/features_next/events/assets/images/map/event-past.png'

import { ActionType } from '@/services/actions/schema'
import type { RestItemEvent } from '@/services/events/schema'

export type HubItemMapInitialBounds = { ne: [number, number]; sw: [number, number] }

/** Cadre caméra initial (source de vérité). */
export const FRANCE_METRO_CAMERA_BOUNDS: HubItemMapInitialBounds = {
  ne: [9.7, 51.6],
  sw: [-6.2, 40.3],
}

const HUB_ITEM_MAP_STYLE_URL = 'mapbox://styles/larem/clwaph1m1008501pg1cspgbj2'

/** Fallback caméra si `centerCoordinate` / `zoomLevel` absents (ex. props partielles). */
const DEFAULT_CENTER: [number, number] = [2.45, 46.55]

const EVENT_PIN_MARKERS_IMAGES = {
  'pin-event-past': pinEventPast,
  'pin-event-militants': pinEventMilitants,
  'pin-event-adherents': pinEventAdherents,
  'pin-event-invitation': pinEventInvitation,
} as const

const HUB_ACTION_PIN_MARKERS_IMAGES = {
  'hub-action-pap': pinPap,
  'hub-action-boitage': pinBoitage,
  'hub-action-tractage': pinTractage,
  'hub-action-collage': pinCollage,
} as const

const MAP_PIN_MARKERS_IMAGES = {
  ...EVENT_PIN_MARKERS_IMAGES,
  ...HUB_ACTION_PIN_MARKERS_IMAGES,
} as const

export type HubItemMapPinImageKey = keyof typeof MAP_PIN_MARKERS_IMAGES

type EventPinResolverInput = {
  visibility: RestItemEvent['visibility']
  isPast: boolean
}

const resolveEventPinImageKey = (item: EventPinResolverInput): HubItemMapPinImageKey => {
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

const resolveActionPinImageKey = (actionType: ActionType, isPast: boolean, isCancelled: boolean): HubItemMapPinImageKey => {
  if (isPast || isCancelled) {
    return 'pin-event-past'
  }

  switch (actionType) {
    case ActionType.PAP:
      return 'hub-action-pap'
    case ActionType.BOITAGE:
      return 'hub-action-boitage'
    case ActionType.TRACTAGE:
      return 'hub-action-tractage'
    case ActionType.COLLAGE:
      return 'hub-action-collage'
    default:
      return 'hub-action-tractage'
  }
}

const resolveMapPinImageKey = (item: HubItemMapItem): HubItemMapPinImageKey => {
  if (item.itemType === 'action' && item.actionType) {
    return resolveActionPinImageKey(item.actionType, item.isPast, item.isCancelled ?? false)
  }

  return resolveEventPinImageKey({ visibility: item.visibility, isPast: item.isPast })
}

/** Raster réel des PNG (points) pour caler une cible UI ~48×53 px sous `iconSize` homogène. */
const EVENT_PIN_IMAGE_RASTER_WIDTH = 104
const EVENT_PIN_IMAGE_RASTER_HEIGHT = 114
const EVENT_PIN_ICON_SIZE = Math.min(48 / EVENT_PIN_IMAGE_RASTER_WIDTH, 53 / EVENT_PIN_IMAGE_RASTER_HEIGHT)

const HUB_ITEM_POINT_SYMBOL_STYLE = {
  iconImage: ['get', 'pinImageId'],
  iconSize: EVENT_PIN_ICON_SIZE,
  iconAllowOverlap: true,
  iconIgnorePlacement: true,
  iconAnchor: 'bottom' as const,
  symbolSortKey: ['get', 'sortOrder'],
} as const

/** Halo + point bleu style Maps, en `CircleLayer` (web + natif). */
const USER_LOCATION_OUTER_STYLE = {
  circleRadius: 12,
  circleColor: 'rgba(66, 133, 244, 0.35)',
} as const

const USER_LOCATION_INNER_STYLE = {
  circleRadius: 6,
  circleColor: '#4285F4',
  circleStrokeColor: '#FFFFFF',
  circleStrokeWidth: 2,
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
  if (distanceKm <= 0.4) return 16
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

const USER_LOCATION_COORD_DECIMALS = 4

/** Arrondi position utilisateur pour stabiliser les clés de requête carte hub. */
export const roundCoordinateForMapSortAround = (value: number) => {
  const f = 10 ** USER_LOCATION_COORD_DECIMALS
  return Math.round(value * f) / f
}

const roundLngLat = (p: GeoPosition): GeoPosition => {
  const f = 10 ** VISIBLE_BOUNDS_LNGLAT_DECIMALS
  return [Math.round(p[0] * f) / f, Math.round(p[1] * f) / f] as GeoPosition
}

export type HubItemMapItem = {
  uuid: string
  name: string
  slug: string | null
  itemType: 'event' | 'action'
  actionType?: ActionType
  latitude: number
  longitude: number
  visibility: RestItemEvent['visibility']
  isPast: boolean
  isCancelled?: boolean
}

const computeUserCenterCamera = (userCoords: [number, number], items: HubItemMapItem[]): { center: [number, number]; zoom: number } => {
  if (items.length === 0) {
    return { center: userCoords, zoom: 12 }
  }
  const itemCoordinates = items.map((item) => [item.longitude, item.latitude] as [number, number])
  const nearestItem = itemCoordinates.reduce(
    (acc, coords) => {
      const km = distanceInKm(userCoords, coords)
      if (km < acc.distanceKm) {
        return { coords, distanceKm: km }
      }
      return acc
    },
    { coords: itemCoordinates[0], distanceKm: Number.POSITIVE_INFINITY },
  )

  const nextCenter: [number, number] =
    nearestItem.distanceKm > 10 ? [(userCoords[0] + nearestItem.coords[0]) / 2, (userCoords[1] + nearestItem.coords[1]) / 2] : userCoords

  return { center: nextCenter, zoom: getZoomForNearestDistance(nearestItem.distanceKm) }
}

export type HubItemMapFeatureProperties = {
  uuid: string
  name: string
  slug: string | null
  itemType: 'event' | 'action'
  pinImageId: HubItemMapPinImageKey
}

export type HubItemMapHandle = {
  animateCameraTo: (centerCoordinate: [number, number], zoomLevel: number) => void
  flyToUserWithItemsZoom: (userCoords: [number, number]) => void
  getVisibleBounds: () => Promise<[GeoPosition, GeoPosition]>
}

type HubItemMapSharedProps = {
  items: HubItemMapItem[]
  isInteractive?: boolean
  clusterItems?: boolean
  onItemPress: (event: OnPressEvent) => void
  padding?: CameraPadding
  /** `[lng, lat]` — affichée via marqueur custom (source : page / `expo-location`). */
  userLocationLngLat?: [number, number] | null
  /** Carte dans un scroll parent (ex. header FlatList hub mobile) — active `requestDisallowInterceptTouchEvent` sur Android. */
  embeddedInScrollView?: boolean
}

export type HubItemMapProps =
  | (HubItemMapSharedProps & {
      /** Vue de départ : cadrer ce rectangle (remplace center + zoom). */
      initialBounds: HubItemMapInitialBounds
      centerCoordinate?: [number, number]
      zoomLevel?: number
    })
  | (HubItemMapSharedProps & {
      initialBounds?: undefined
      centerCoordinate: [number, number]
      zoomLevel: number
    })

const HubItemMap = forwardRef<HubItemMapHandle, HubItemMapProps>(
  (
    {
      items,
      isInteractive = true,
      clusterItems = false,
      onItemPress,
      initialBounds,
      centerCoordinate,
      zoomLevel,
      padding,
      userLocationLngLat,
      embeddedInScrollView = false,
    },
    ref,
  ) => {
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

    const flyToUserWithItemsZoom = useCallback(
      (userCoords: [number, number]) => {
        const { center, zoom } = computeUserCenterCamera(userCoords, items)
        animateCameraTo(center, zoom)
      },
      [animateCameraTo, items],
    )

    const getVisibleBounds = useCallback(() => {
      const map = mapViewRef.current
      if (!map) {
        return Promise.reject(new Error('HubItemMap: MapView is not mounted'))
      }
      return map.getVisibleBounds().then(([ne, sw]) => [roundLngLat(ne), roundLngLat(sw)] as [GeoPosition, GeoPosition])
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        animateCameraTo,
        flyToUserWithItemsZoom,
        getVisibleBounds,
      }),
      [animateCameraTo, flyToUserWithItemsZoom, getVisibleBounds],
    )

    const shape = useMemo<FeatureCollection<Point, HubItemMapFeatureProperties>>(() => {
      const spreadById = spreadMapCoordinates(
        items.map((item) => ({ id: item.uuid, longitude: item.longitude, latitude: item.latitude })),
        { radiusMeters: 5 },
      )
      return {
        type: 'FeatureCollection',
        features: items.map((item, index) => ({
          type: 'Feature',
          properties: {
            uuid: item.uuid,
            name: item.name,
            slug: item.slug,
            itemType: item.itemType,
            pinImageId: resolveMapPinImageKey(item),
            sortOrder: index,
          },
          geometry: {
            type: 'Point',
            coordinates: spreadById.get(item.uuid) ?? [item.longitude, item.latitude],
          },
        })),
      }
    }, [items])

    const userLocationFeature = useMemo((): Feature<Point> | null => {
      if (!userLocationLngLat) {
        return null
      }
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: userLocationLngLat },
        properties: {},
      }
    }, [userLocationLngLat])

    const cameraProps = initialBounds ? { bounds: initialBounds } : { centerCoordinate: centerCoordinate ?? DEFAULT_CENTER, zoomLevel: zoomLevel ?? 10 }

    return (
      <MapboxGl.MapView
        ref={mapViewRef}
        style={{ flex: 1 }}
        styleURL={HUB_ITEM_MAP_STYLE_URL}
        scaleBarEnabled={false}
        scrollEnabled={isInteractive}
        zoomEnabled={isInteractive}
        rotateEnabled={false}
        pitchEnabled={false}
        {...(Platform.OS === 'android' && embeddedInScrollView && isInteractive
          ? { requestDisallowInterceptTouchEvent: true }
          : {})}
      >
        <MapboxGl.Camera ref={cameraRef} followUserLocation={false} padding={padding} {...cameraProps} />
        <MapboxGl.Images images={MAP_PIN_MARKERS_IMAGES} />
        {clusterItems ? (
          <MapboxGl.ShapeSource
            id="hub-item-map-source"
            shape={shape}
            onPress={onItemPress}
            cluster
            clusterRadius={40}
            clusterMaxZoomLevel={18}
            hitbox={{ width: 52, height: 58 }}
          >
            <MapboxGl.CircleLayer
              id="hub-item-map-clusters"
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
              id="hub-item-map-cluster-count"
              filter={['has', 'point_count']}
              style={{
                textField: ['to-string', ['get', 'point_count']],
                textSize: 14,
                textColor: '#FFFFFF',
              }}
            />
            <MapboxGl.SymbolLayer id="hub-item-map-points" filter={['!', ['has', 'point_count']]} style={HUB_ITEM_POINT_SYMBOL_STYLE} />
          </MapboxGl.ShapeSource>
        ) : (
          <MapboxGl.ShapeSource
            id="hub-item-map-source"
            shape={shape}
            onPress={onItemPress}
            cluster={false}
            clusterRadius={40}
            hitbox={{ width: 52, height: 58 }}
          >
            <MapboxGl.SymbolLayer id="hub-item-map-points" filter={['all']} style={HUB_ITEM_POINT_SYMBOL_STYLE} />
          </MapboxGl.ShapeSource>
        )}
        {userLocationFeature ? (
          <MapboxGl.ShapeSource id="hub-item-map-user-location" shape={userLocationFeature} cluster={false}>
            <MapboxGl.CircleLayer id="hub-item-map-user-location-outer" style={USER_LOCATION_OUTER_STYLE} />
            <MapboxGl.CircleLayer id="hub-item-map-user-location-inner" style={USER_LOCATION_INNER_STYLE} />
          </MapboxGl.ShapeSource>
        ) : null}
      </MapboxGl.MapView>
    )
  },
)

HubItemMap.displayName = 'HubItemMap'

export default HubItemMap
