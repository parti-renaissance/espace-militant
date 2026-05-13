import React, { ComponentProps, ComponentRef, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import {
  CameraStop,
  type Camera as C,
  type CircleLayer as CL,
  type FillLayer as FL,
  type Images as Img,
  type MapView as MV,
  type ShapeSource as SS,
  type UserLocation as UL,
} from '@rnmapbox/maps'
import type mapboxgl from 'mapbox-gl'
import ReactMapGL, { Layer, MapRef, PaddingOptions, Source, useMap } from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

import _ from 'lodash'
import { create } from 'zustand'

import type { UserLocationProps } from './Mapbox'

// --- TYPES & UTILITAIRES ---

type CameraPadding = {
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
}

type ShapeSourceRef = {
  getClusterExpansionZoom: (feature: string | GeoJSON.Feature) => Promise<number>
  getClusterChildren: (feature: number | GeoJSON.Feature) => Promise<GeoJSON.Feature[]>
}

type MapViewRef = {
  getCenter: () => Promise<[number, number]>
  getVisibleBounds: () => Promise<[[number, number], [number, number]]>
}

const mapPadding = (padding?: CameraPadding): PaddingOptions | undefined => {
  if (!padding) return undefined
  return {
    top: padding?.paddingTop || 0,
    bottom: padding?.paddingBottom || 0,
    left: padding?.paddingLeft || 0,
    right: padding?.paddingRight || 0,
  }
}

const hasMeaningfulCenterDelta = (from: [number, number], to: [number, number]) => {
  const deltaLng = Math.abs(from[0] - to[0])
  const deltaLat = Math.abs(from[1] - to[1])
  return deltaLng > 0.0001 || deltaLat > 0.0001
}

const easeInOutCubic = (t: number) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

const toKebabCase = (str: string) => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

export enum UserTrackingMode {
  Follow = 'normal',
  FollowWithHeading = 'compass',
  FollowWithCourse = 'course',
}

// --- STORE & STATE MANAGEMENT ---

type ShareState = {
  followUserLocation: boolean
  setFollowUserLocation: (follow: boolean) => void
  interactiveLayerIds: string[]
  addInteractiveLayer: (id: string) => void
  removeInteractiveLayer: (id: string) => void
}

const useStore = create<ShareState>((set) => ({
  followUserLocation: false,
  setFollowUserLocation: (followUserLocation: boolean) => set({ followUserLocation }),
  interactiveLayerIds: [],
  addInteractiveLayer: (id: string) =>
    set((state) => ({
      interactiveLayerIds: state.interactiveLayerIds.includes(id) ? state.interactiveLayerIds : [...state.interactiveLayerIds, id],
    })),
  removeInteractiveLayer: (id: string) =>
    set((state) => ({
      interactiveLayerIds: state.interactiveLayerIds.filter((layerId) => layerId !== id),
    })),
}))

const layerClickHandlers = new Map<string, (e: mapboxgl.MapLayerMouseEvent) => void>()

const staticStore = {
  accessToken: '',
  followUserMode: UserTrackingMode.Follow,
  followZoomLevel: 18,
  mapRef: null as MapRef | null,
}

export const setAccessToken = (accessToken: string) => {
  staticStore.accessToken = accessToken
}

// --- COMPOSANTS ---

const MapView = forwardRef<MapViewRef, ComponentProps<typeof MV>>((props, ref) => {
  const mapRef = useRef<MapRef>(null)
  const interactiveLayerIds = useStore((state) => state.interactiveLayerIds)

  useEffect(() => {
    staticStore.mapRef = mapRef.current
    return () => {
      if (staticStore.mapRef === mapRef.current) {
        staticStore.mapRef = null
      }
    }
  }, [])

  useImperativeHandle(ref, () => {
    return {
      getCenter: async () => {
        const region = mapRef.current?.getCenter()
        return region ? [region.lng, region.lat] : [0, 0]
      },
      getVisibleBounds: async () => {
        const map = mapRef.current
        if (!map) {
          throw new Error('MapView is not ready')
        }
        const bounds = map.getBounds()
        const ne = bounds.getNorthEast()
        const sw = bounds.getSouthWest()
        return [
          [ne.lng, ne.lat],
          [sw.lng, sw.lat],
        ]
      },
    }
  }, [])

  const { children, styleURL, pitchEnabled, scrollEnabled, zoomEnabled, rotateEnabled } = props

  const handleMapClick = useCallback((e: mapboxgl.MapLayerMouseEvent) => {
    if (!e.features || e.features.length === 0) return

    const clickedFeature = e.features[0]
    const sourceId = clickedFeature.source
    const layerId = clickedFeature.layer?.id

    const handler = layerClickHandlers.get(sourceId) || (layerId ? layerClickHandlers.get(layerId) : undefined)
    if (handler) {
      handler(e)
    }
  }, [])

  const resetMapCursor = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    map.getCanvas().style.cursor = pitchEnabled === false ? 'default' : ''
  }, [pitchEnabled])

  const handleInteractiveLayersMouseMove = useCallback(
    (e: mapboxgl.MapLayerMouseEvent) => {
      const map = mapRef.current?.getMap()
      if (!map) return
      if (pitchEnabled === false) {
        map.getCanvas().style.cursor = 'default'
        return
      }
      const features = e.features
      map.getCanvas().style.cursor = features && features.length > 0 ? 'pointer' : ''
    },
    [pitchEnabled],
  )

  const dragPan = scrollEnabled !== false
  const scrollZoom = zoomEnabled !== false
  const dragRotate = rotateEnabled !== false

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxAccessToken={staticStore.accessToken}
      mapStyle={styleURL}
      pitchWithRotate={pitchEnabled}
      dragPan={dragPan}
      scrollZoom={scrollZoom}
      doubleClickZoom={scrollZoom}
      touchZoomRotate={scrollZoom}
      dragRotate={dragRotate}
      keyboard={dragPan || scrollZoom}
      onClick={handleMapClick}
      onMouseMove={handleInteractiveLayersMouseMove}
      onMouseLeave={resetMapCursor}
      onMouseOut={resetMapCursor}
      interactiveLayerIds={interactiveLayerIds.length > 0 ? interactiveLayerIds : undefined}
    >
      {children}
    </ReactMapGL>
  )
})

export const ShapeSource = forwardRef<ShapeSourceRef, ComponentProps<typeof SS>>((props, ref) => {
  const { current: map } = useMap()

  useEffect(() => {
    if (props.id && props.onPress) {
      layerClickHandlers.set(props.id, props.onPress as unknown as (e: mapboxgl.MapLayerMouseEvent) => void)
    }
    return () => {
      if (props.id) layerClickHandlers.delete(props.id)
    }
  }, [props.id, props.onPress])

  useImperativeHandle(
    ref,
    () => ({
      getClusterExpansionZoom: (feature: string | GeoJSON.Feature) => {
        return new Promise<number>((resolve, reject) => {
          const source = map?.getSource(props.id as string) as mapboxgl.GeoJSONSource | undefined
          if (!source) return reject(new Error('Source not found'))

          const clusterId = typeof feature === 'string' ? parseInt(feature, 10) : (feature.id as number)
          if (typeof clusterId !== 'number' || isNaN(clusterId)) return reject(new Error('Invalid cluster ID'))

          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) reject(err)
            else resolve(zoom)
          })
        })
      },
      getClusterChildren: (feature: number | GeoJSON.Feature) => {
        return new Promise<GeoJSON.Feature[]>((resolve, reject) => {
          const source = map?.getSource(props.id as string) as mapboxgl.GeoJSONSource | undefined
          if (!source) return reject(new Error('Source not found'))

          const clusterId = typeof feature === 'number' ? feature : (feature.id as number)
          if (typeof clusterId !== 'number' || isNaN(clusterId)) return reject(new Error('Invalid cluster ID'))

          source.getClusterChildren(clusterId, (err, features) => {
            if (err) reject(err)
            else resolve(features as GeoJSON.Feature[])
          })
        })
      },
    }),
    [map, props.id],
  )

  const clusterEnabled = props.cluster ?? false
  const clusterRadius = props.clusterRadius ?? 40

  return (
    <Source
      id={props.id}
      cluster={clusterEnabled}
      clusterRadius={clusterRadius}
      type="geojson"
      data={props.shape as GeoJSON.FeatureCollection | GeoJSON.Feature | string}
      {...(clusterEnabled && props.clusterProperties != null
        ? { clusterProperties: props.clusterProperties as Record<string, unknown> }
        : {})}
    >
      {props.children}
    </Source>
  )
})

const useRegisterLayer = (id?: string) => {
  const addInteractiveLayer = useStore((s) => s.addInteractiveLayer)
  const removeInteractiveLayer = useStore((s) => s.removeInteractiveLayer)

  useEffect(() => {
    if (id) {
      addInteractiveLayer(id)
      return () => removeInteractiveLayer(id)
    }
  }, [id, addInteractiveLayer, removeInteractiveLayer])
}

/** Mapbox GL web : ne pas passer `filter` si ce n'est pas un tableau valide. */
const filterProps = (filter: unknown) => (Array.isArray(filter) && filter.length > 0 ? { filter } : {})

const CircleLayer = (props: ComponentProps<typeof CL> & { source?: string }) => {
  useRegisterLayer(props.id)
  const paint = useMemo(() => _.mapKeys(props.style, (_, k) => toKebabCase(k)), [props.style])
  return <Layer id={props.id} type="circle" source={props.source} paint={paint} {...filterProps(props.filter)} />
}

const SymbolLayer = (props: ComponentProps<typeof CL> & { source?: string }) => {
  useRegisterLayer(props.id)
  const { textColor, ...rest } = props.style || {}
  const paint = useMemo(() => _.mapKeys(textColor ? { textColor } : {}, (_, k) => toKebabCase(k)), [textColor])
  const layout = useMemo(() => _.mapKeys(rest, (_, k) => toKebabCase(k)), [rest])

  return (
    <Layer id={props.id} type="symbol" source={props.source} layout={layout} paint={paint} {...filterProps(props.filter)} />
  )
}

const FillLayer = (props: ComponentProps<typeof FL> & { source?: string }) => {
  const paint = useMemo(() => _.mapKeys(props.style ?? {}, (_, k) => toKebabCase(k)), [props.style])
  return <Layer id={props.id} type="fill" source={props.source} paint={paint} {...filterProps(props.filter)} />
}

export const Images = (props: ComponentProps<typeof Img>) => {
  const { current: map } = useMap()

  useEffect(() => {
    if (!props.images || !map) return

    Object.entries(props.images).forEach(([id, source]) => {
      const sourceObj = source as { uri?: string }
      const url = typeof source === 'string' ? source : sourceObj?.uri
      if (!url || map.hasImage(id)) return

      map.loadImage(url, (error, image) => {
        if (error) {
          console.error(`Error loading mapbox image [${id}]:`, error)
          return
        }
        if (image && !map.hasImage(id)) {
          map.addImage(id, image)
        }
      })
    })
  }, [props.images, map])

  return null
}

const Camera = forwardRef<React.ComponentRef<typeof C>, ComponentProps<typeof C>>((props, ref) => {
  const maps = useMap()
  const setFollowUserLocation = useStore((s) => s.setFollowUserLocation)

  // Cette ref est la clé : elle empêche le 'jumpTo' de couper nos animations futures !
  const hasAppliedInitialViewRef = useRef(false)

  const lastAppliedPaddingKeyRef = useRef('')

  const getActiveMap = useCallback(() => maps.current ?? staticStore.mapRef, [maps])

  useEffect(() => {
    setFollowUserLocation(Boolean(props.followUserLocation))
    if (props.followUserMode) staticStore.followUserMode = props.followUserMode as UserTrackingMode
    if (props.followZoomLevel) staticStore.followZoomLevel = props.followZoomLevel
  }, [props.followUserLocation, props.followUserMode, props.followZoomLevel, setFollowUserLocation])

  useEffect(() => {
    if (props.padding) {
      const map = getActiveMap()

      const nextPaddingKey = `${props.padding.paddingTop || 0}-${props.padding.paddingRight || 0}-${props.padding.paddingBottom || 0}-${props.padding.paddingLeft || 0}`

      if (nextPaddingKey !== lastAppliedPaddingKeyRef.current) {
        map?.setPadding(mapPadding(props.padding as CameraPadding)!)
        lastAppliedPaddingKeyRef.current = nextPaddingKey
      }
    }
  }, [getActiveMap, props.padding])

  // Initialisation de la vue (Se lance UNE SEULE FOIS)
  useEffect(() => {
    const map = getActiveMap()
    if (!map || hasAppliedInitialViewRef.current) return

    const b = props.bounds
    if (b?.ne && b?.sw) {
      // Le padding caméra est déjà appliqué via map.setPadding ; ne pas le repasser à fitBounds (double comptage).
      map.fitBounds([b.sw, b.ne] as [mapboxgl.LngLatLike, mapboxgl.LngLatLike], { duration: 0 })
      hasAppliedInitialViewRef.current = true
      return
    }

    const center = props.centerCoordinate as [number, number] | undefined
    const zoom = props.zoomLevel
    if (!center) return

    map.jumpTo({ center, zoom })
    hasAppliedInitialViewRef.current = true
  }, [getActiveMap, props.bounds, props.centerCoordinate, props.zoomLevel])

  useImperativeHandle(
    ref,
    () => ({
      setCamera: (opt: CameraStop) => {
        const map = getActiveMap()
        if (!map) return

        const duration = opt.animationDuration ?? 2000

        if (opt.bounds?.ne && opt.bounds?.sw) {
          map.fitBounds([opt.bounds.sw, opt.bounds.ne] as [mapboxgl.LngLatLike, mapboxgl.LngLatLike], { duration })
          return
        }

        const padding = mapPadding(opt.padding as CameraPadding)

        // 1. On construit l'objet de base sans aucune valeur undefined
        const cameraOptions: mapboxgl.FlyToOptions & mapboxgl.AnimationOptions = {
          duration,
          essential: true,
        }

        // 2. On injecte les paramètres UNIQUEMENT s'ils sont définis
        if (opt.centerCoordinate) {
          cameraOptions.center = opt.centerCoordinate as [number, number]
        }
        if (typeof opt.zoomLevel === 'number') {
          cameraOptions.zoom = opt.zoomLevel
        }
        if (padding) {
          cameraOptions.padding = padding
        }

        // Sécurité : S'il n'y a ni centre, ni zoom, ni padding, on ne fait rien
        if (!cameraOptions.center && cameraOptions.zoom === undefined && !cameraOptions.padding) {
          return
        }

        // 3. Exécution
        if (duration === 0) {
          map.jumpTo(cameraOptions)
          return
        }

        const animationMethod = opt.animationMode === 'flyTo' ? 'flyTo' : 'easeTo'

        // 4. On passe l'objet parfaitement propre à Mapbox
        map[animationMethod](cameraOptions)
      },
      flyTo: (coordinates: [number, number], duration = 2000) => {
        getActiveMap()?.flyTo({ center: coordinates, duration })
      },
      moveTo: (coordinates: [number, number], duration = 2000) => {
        getActiveMap()?.panTo(coordinates, { duration })
      },
      zoomTo: (zoomLevel: number, duration = 2000) => {
        getActiveMap()?.zoomTo(zoomLevel, { duration })
      },
      fitBounds: (ne: [number, number], sw: [number, number], padding?: number | number[], duration = 2000) => {
        let pad: PaddingOptions | number | undefined = undefined
        if (typeof padding === 'number') {
          pad = padding
        } else if (Array.isArray(padding)) {
          pad = { top: padding?.[0] || 0, right: padding?.[1] || 0, bottom: padding?.[2] || 0, left: padding?.[3] || 0 }
        }
        getActiveMap()?.fitBounds([sw, ne], { padding: pad, duration })
      },
      moveBy: (opt: { x: number; y: number; animationMode?: 'easeTo' | 'linearTo'; animationDuration?: number }) => {
        getActiveMap()?.panBy([opt.x, opt.y], { duration: opt.animationDuration ?? 2000 })
      },
      scaleBy: (opt: { x: number; y: number; scaleFactor: number; animationMode?: 'easeTo' | 'linearTo'; animationDuration?: number }) => {
        const map = getActiveMap()
        const currentZoom = map?.getZoom() || 0
        map?.zoomTo(currentZoom + opt.scaleFactor, { duration: opt.animationDuration ?? 2000 })
      },
    }),
    [getActiveMap],
  )

  return null
})

const UserLocation = forwardRef<ComponentRef<typeof UL>, UserLocationProps>((_props, _ref) => null)
UserLocation.displayName = 'UserLocation'

export default {
  MapView,
  ShapeSource,
  CircleLayer,
  FillLayer,
  SymbolLayer,
  Camera,
  UserLocation,
  setAccessToken,
  UserTrackingMode,
  Images,
}
