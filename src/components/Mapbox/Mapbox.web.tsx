import React, { ComponentProps, ComponentRef, forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import {
  CameraStop,
  type Camera as C,
  type CircleLayer as CL,
  type Images as Img,
  type MapView as MV,
  type ShapeSource as SS,
  type UserLocation as UL,
} from '@rnmapbox/maps'
import * as Image from 'expo-image'
import type mapboxgl from 'mapbox-gl'
import Map, { GeolocateControl, Layer, MapRef, PaddingOptions, Source, useMap } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import _ from 'lodash'
import { MapLayerMouseEvent } from 'mapbox-gl'
import { create } from 'zustand'
import MapboxGl from './Mapbox'

const mapPadding = (padding?: MapboxGl.CameraPadding): PaddingOptions | undefined => {
  if (!padding) return undefined
  return {
    top: padding.paddingTop,
    bottom: padding.paddingBottom,
    left: padding.paddingLeft,
    right: padding.paddingRight,
  }
}

type ShareState = {
  followUserLocation?: boolean
  setFollowUserLocation: (followUserLocation?: boolean) => void
}

const shareState = create<ShareState>((set) => ({
  followUserLocation: false,
  setFollowUserLocation: (followUserLocation: boolean) => set({ followUserLocation }),
}))
// convert CircleRadius to circle-radiuShareStates
const toKebabCase = (str: string) => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

export enum UserTrackingMode {
  Follow = 'normal',
  FollowWithHeading = 'compass',
  FollowWithCourse = 'course',
}

const staticStore = {
  accessToken: '',
  onClick: (e: MapLayerMouseEvent): void => {
    // console.log(e, e.features)
  },
  followUserMode: UserTrackingMode.Follow,
  followZoomLevel: 18,
}

export const setAccessToken = (accessToken: string) => {
  staticStore.accessToken = accessToken
}

const MapView = forwardRef<MapRef, ComponentProps<typeof MV>>((props, ref) => {
  const transformProps = {
    pitchWithRotate: props.pitchEnabled,
    mapboxAccessToken: staticStore.accessToken,
    mapStyle: props.styleURL,
  } satisfies ComponentProps<typeof Map>

  const mapRef = useRef<MapRef>(null)

  useImperativeHandle(
    ref,
    () => ({
      // @ts-ignore
      getCenter() {
        const region = mapRef.current?.getCenter()
        return [region?.lng, region?.lat]
      },
    }),
    [],
  )

  const { children, ...restProps } = props

  const layersID = useMemo(() => {
    const sourceChidlrens = React.Children.toArray(children).filter((x) => {
      if (React.isValidElement(x) && x.type === ShapeSource) {
        return true
      }
      return false
    })
    // @ts-ignore
    return sourceChidlrens.flatMap((sourceChidlren) =>
      React.Children.toArray(sourceChidlren?.props.children)
        .map((x) => {
          if (React.isValidElement(x)) {
            return x.props.id
          }
          return ''
        })
        .filter((x) => Boolean(x)),
    )
  }, [props.children])

  if (layersID.length === 0) {
    return null
  }

  return (
    <Map ref={mapRef} {...transformProps} onClick={staticStore.onClick} interactiveLayerIds={layersID}>
      {props.children}
    </Map>
  )
})

export const ShapeSource = forwardRef<React.ComponentRef<typeof SS>, ComponentProps<typeof SS>>((props, ref) => {
  staticStore.onClick = props.onPress as unknown as (e: MapLayerMouseEvent) => void
  const { current: map } = useMap()
  useImperativeHandle(
    ref,
    () => ({
      getClusterExpansionZoom(feature) {
        return new Promise((resolve, reject) =>
          // @ts-ignore
          map?.getSource(props.id)?.getClusterExpansionZoom(feature.id, (err, zoom) => {
            if (err) {
              reject(err)
            } else {
              resolve(zoom)
            }
          }),
        )
      },
      // @ts-ignore
      getClusterChildren(clusterId) {},
    }),
    [map],
  )
  return (
    <Source
      id={props.id}
      cluster={props.cluster}
      clusterRadius={props.clusterRadius}
      type="geojson"
      // @ts-ignore
      data={props.shape}
      clusterProperties={props.clusterProperties}
    >
      {props.children}
    </Source>
  )
})

const CircleLayer = (props: ComponentProps<typeof CL> & { source?: string }) => {
  const paint = useMemo(() => _.mapKeys(props.style, (x, k) => toKebabCase(k)), [])
  return <Layer id={props.id} type="circle" source={props.source} filter={props.filter} paint={paint} />
}
const SymbolLayer = (props: ComponentProps<typeof CL> & { source?: string }) => {
  const { textColor, ...rest } = props.style
  const paint = useMemo(() => _.mapKeys(textColor ? { textColor } : {}, (x, k) => toKebabCase(k)), [])
  const layout = useMemo(() => _.mapKeys(rest, (x, k) => toKebabCase(k)), [])
  return <Layer id={props.id} type="symbol" source={props.source} filter={props.filter} layout={layout} paint={paint} />
}

export const Images = (props: ComponentProps<typeof Img>) => {
  const { current: map } = useMap()
  const imageRefs = useRef({})
  const imgs = props.images ? Object.entries(props.images) : []
  const urls = Object.entries(imageRefs.current).map(([id, ref]) => [id, ref?.nativeViewRef?.current?.src])

  useEffect(() => {
    urls.forEach(([id, url]) => {
      map?.loadImage(url, (error, image) => {
        if (error) {
          return
        }
        if (map?.hasImage(id)) return
        map?.addImage(id, image)
      })
    })
  }, [urls])
  return (
    <div hidden>
      {imgs.map(([id, url]) => (
        <Image.Image key={id} source={url} ref={(x) => (imageRefs.current[id] = x)} />
      ))}
    </div>
  )
}

const Camera = forwardRef<React.ComponentRef<typeof C>, ComponentProps<typeof C>>((props: ComponentProps<typeof C>, ref) => {
  const { current: map } = useMap()

  const { setFollowUserLocation } = shareState()

  useEffect(() => {
    setFollowUserLocation(props.followUserLocation)
  }, [props.followUserLocation])

  // @ts-ignore
  staticStore.followUserLocation = props.followUserLocation
  // @ts-ignore
  staticStore.followUserMode = props.followUserMode
  // @ts-ignore
  staticStore.followZoomLevel = props.followZoomLevel

  useEffect(() => {
    if (props.padding) {
      map?.setPadding(mapPadding(props.padding)!)
    }
  }, [props.padding])

  useImperativeHandle(
    ref,
    () => ({
      setCamera: (opt: CameraStop) => {
        map?.flyTo({
          center: opt.centerCoordinate as [number, number],
          zoom: opt.zoomLevel,
          essential: true,
          padding: mapPadding(opt.padding),
          animate: true,
          duration: opt.animationDuration,
        })
      },
      flyTo: (opt) => {
        throw new Error('Method not implemented.')
      },
      moveTo: (opt) => {
        throw new Error('Method not implemented.')
      },
      zoomTo: (opt) => {
        throw new Error('Method not implemented.')
      },
      fitBounds: (opt) => {
        throw new Error('Method not implemented.')
      },
    }),
    [map],
  )

  return null
})

const UserLocation = forwardRef<ComponentRef<typeof UL>, ComponentProps<typeof UL>>((props, ref) => {
  const geoControlRef = useRef<mapboxgl.GeolocateControl>(null)

  const { followUserLocation } = shareState()
  useEffect(() => {
    setTimeout(() => {
      geoControlRef.current?.trigger()
    }, 1000)
  }, [])
  return (
    <GeolocateControl
      ref={geoControlRef}
      showUserLocation
      showAccuracyCircle={false}
      showUserHeading={followUserLocation}
      fitBoundsOptions={{
        zoom: staticStore.followZoomLevel,
        minZoom: Infinity,
        maxDuration: Infinity,
      }}
      trackUserLocation
      onGeolocate={(e) => {
        props.onUpdate?.({
          coords: {
            latitude: e.coords.latitude,
            longitude: e.coords.longitude,
            altitude: e.coords.altitude ?? undefined,
            accuracy: e.coords.accuracy,
            heading: e.coords.heading ?? undefined,
            speed: e.coords.speed ?? undefined,
          },
          timestamp: e.timestamp,
        })
      }}
      positionOptions={{
        enableHighAccuracy: true,
      }}
    />
  )
})

export default {
  MapView,
  ShapeSource,
  CircleLayer,
  SymbolLayer,
  Camera,
  UserLocation,
  setAccessToken,
  UserTrackingMode,
  Images,
}
