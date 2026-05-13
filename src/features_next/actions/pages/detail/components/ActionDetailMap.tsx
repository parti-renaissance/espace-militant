import React, { useMemo } from 'react'
import { useMedia, YStack } from 'tamagui'
import { isBefore } from 'date-fns'

import MapboxGl from '@/components/Mapbox/Mapbox'

import { createSource } from '@/screens/actions/utils'
import { ActionType, RestAction, RestActionFull } from '@/services/actions/schema'

import pinBoitage from '../../../assets/map/action-boitage.png'
import pinCollage from '../../../assets/map/action-collage.png'
import pinPap from '../../../assets/map/action-porte-a-porte.png'
import pinTractage from '../../../assets/map/action-tractage.png'

/** Clés Mapbox — alignées sur `ActionType` côté GeoJSON (`createSource`). */
const ACTION_DETAIL_MAP_IMAGES = {
  'action-detail-pap': pinPap,
  'action-detail-boitage': pinBoitage,
  'action-detail-tractage': pinTractage,
  'action-detail-collage': pinCollage,
} as const

const detailPinIconImage = [
  'match',
  ['get', 'type'],
  ActionType.PAP,
  'action-detail-pap',
  ActionType.BOITAGE,
  'action-detail-boitage',
  ActionType.TRACTAGE,
  'action-detail-tractage',
  ActionType.COLLAGE,
  'action-detail-collage',
  'action-detail-tractage',
] as const

type ActionDetailMapProps = {
  action: RestAction | RestActionFull
}

export function ActionDetailMap({ action }: ActionDetailMapProps) {
  const shape = useMemo(() => createSource([action as RestAction], action.uuid), [action])
  const center: [number, number] = [action.post_address.longitude, action.post_address.latitude]

  return (
    <MapboxGl.MapView
      styleURL="mapbox://styles/larem/clwaph1m1008501pg1cspgbj2"
      style={{ flex: 1 }}
      scaleBarEnabled={false}
      scrollEnabled={false}
      zoomEnabled={false}
      rotateEnabled={false}
      pitchEnabled={false}
    >
      <MapboxGl.Camera followUserLocation={false} centerCoordinate={center} zoomLevel={15} />
      <MapboxGl.Images images={ACTION_DETAIL_MAP_IMAGES} />
      <MapboxGl.ShapeSource id="action-detail" shape={shape} cluster={false} onPress={() => {}} hitbox={{ width: 20, height: 20 }}>
        <MapboxGl.SymbolLayer
          id="action-detail-marker"
          filter={['has', 'type']}
          style={{
            iconImage: detailPinIconImage,
            iconSize: 0.42,
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            iconAnchor: 'bottom',
          }}
        />
      </MapboxGl.ShapeSource>
    </MapboxGl.MapView>
  )
}

export function ActionDetailMapBlock({ action }: ActionDetailMapProps) {
  const media = useMedia()
  const height = media.sm ? 250 : 300

  return (
    <YStack height={height} width="100%" flexShrink={0} overflow="hidden" position="relative" borderRadius={0}>
      <ActionDetailMap action={action} />
    </YStack>
  )
}
