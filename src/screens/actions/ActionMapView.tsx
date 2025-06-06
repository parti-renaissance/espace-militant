import React, { forwardRef, useImperativeHandle } from 'react'
import MapboxGl from '@/components/Mapbox/Mapbox'
import clientEnv from '@/config/clientEnv'
import { ActionStatus, ActionType } from '@/services/actions/schema'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'
import * as turf from '@turf/turf'
import markersImage from '../../../assets/images/generated-markers-lib'

const getMarkerIcon = (type: ActionType) => [['==', ['get', 'type'], type], type]
const getActiveMarketIcon = (type: ActionType) => [['==', ['get', 'type'], type], `${type}Active`]

const filterIsActiveAndCancel = ['all', ['==', ['get', 'status'], ActionStatus.CANCELLED], ['==', ['get', 'isActive'], true]]
const getCancelledMarkerIcon = (type: ActionType) => [['==', ['get', 'type'], type], `${type}-${ActionStatus.CANCELLED}`]
const getCancelledActiveMarketIcon = (type: ActionType) => [['==', ['get', 'type'], type], `${type}Active-${ActionStatus.CANCELLED}`]
const getPassedMarkerIcon = (type: ActionType) => [['==', ['get', 'type'], type], `${type}-passed`]
const getPassedActiveMarketIcon = (type: ActionType) => [['==', ['get', 'type'], type], `${type}Active-passed`]
const filterIsActiveAndPassed = ['all', ['==', ['get', 'isPassed'], true], ['==', ['get', 'isActive'], true]]
const getDynamicMarkerIcon = [
  'case',
  filterIsActiveAndCancel,
  ['case', ...Object.values(ActionType).flatMap(getCancelledActiveMarketIcon), ActionType.TRACTAGE],
  filterIsActiveAndPassed,
  ['case', ...Object.values(ActionType).flatMap(getPassedActiveMarketIcon), ActionType.TRACTAGE],
  ['==', ['get', 'status'], ActionStatus.CANCELLED],
  ['case', ...Object.values(ActionType).flatMap(getCancelledMarkerIcon), ActionType.TRACTAGE],
  ['==', ['get', 'isPassed'], true],
  ['case', ...Object.values(ActionType).flatMap(getPassedMarkerIcon), ActionType.TRACTAGE],
  ['==', ['get', 'isActive'], true],
  ['case', ...Object.values(ActionType).flatMap(getActiveMarketIcon), ActionType.TRACTAGE],
  ['case', ...Object.values(ActionType).flatMap(getMarkerIcon), ActionType.TRACTAGE],
]

MapboxGl.setAccessToken(clientEnv.MAP_BOX_ACCESS_TOKEN)

export type MapViewRef = {
  camera: MapboxGl.Camera | null
}

type ActionMapViewProps = {
  onCameraChange: (location: { longitude: number; latitude: number }) => void
  coords?: { longitude: number; latitude: number }
  onMapPress: () => void
  onUserPositionChange: (location: { longitude: number; latitude: number }) => void
  source: MapboxGl.ShapeSource['props']['shape']
  onActionPress: (e: OnPressEvent) => void
  followUser: boolean
  padding?: { paddingBottom: number; paddingLeft: number; paddingRight: number; paddingTop: number }
}

export const ActionMapView = forwardRef<MapViewRef, ActionMapViewProps>(({ coords, ...props }, ref) => {
  const hanldeCameraChange = (state: MapboxGl.MapState) => {
    if (!coords) return
    if (!state.gestures.isGestureActive) return
    const center = state.properties.center
    const dataPoint = turf.point([coords.longitude, coords.latitude])
    const distanceFromCamera = turf.distance(dataPoint, turf.point([center[0], center[1]]), { units: 'meters' })

    if (distanceFromCamera > 1000) {
      props.onCameraChange({ longitude: center[0], latitude: center[1] })
    }
  }

  const handleOnUserLocationUpdate = (x: MapboxGl.Location) => props.onUserPositionChange({ longitude: x.coords.longitude, latitude: x.coords.latitude })

  useImperativeHandle(ref, () => ({ camera: cameraRef.current }))

  const cameraRef = React.useRef<MapboxGl.Camera>(null)
  return (
    <MapboxGl.MapView
      styleURL="mapbox://styles/larem/clwaph1m1008501pg1cspgbj2"
      style={{ flex: 1 }}
      scaleBarEnabled={false}
      onCameraChanged={hanldeCameraChange}
      onPress={props.onMapPress}
    >
      <MapboxGl.Camera
        padding={props.padding}
        ref={cameraRef}
        followUserLocation={props.followUser}
        followUserMode={MapboxGl.UserTrackingMode.Follow}
        followZoomLevel={14}
      />
      <MapboxGl.UserLocation visible onUpdate={handleOnUserLocationUpdate} />

      <MapboxGl.ShapeSource
        id="actions"
        shape={props.source}
        clusterMaxZoomLevel={18}
        cluster={false}
        clusterRadius={35}
        onPress={props.onActionPress}
        hitbox={{ width: 20, height: 20 }}
      >
        <MapboxGl.SymbolLayer
          id="layer-action"
          symbol-sort-key={['to-number', ['get', 'priority']]}
          filter={['has', 'type']}
          style={{
            iconImage: getDynamicMarkerIcon,
            iconSize: 0.5,
            iconAllowOverlap: true,
            iconOffset: [1, -20],
            symbolSortKey: ['to-number', ['get', 'priority']],
          }}
        />
        <MapboxGl.Images images={markersImage} />
      </MapboxGl.ShapeSource>
    </MapboxGl.MapView>
  )
})
