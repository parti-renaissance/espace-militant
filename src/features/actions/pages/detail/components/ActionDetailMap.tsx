import React, { useMemo } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMedia, YStack } from 'tamagui'
import type { CameraPadding } from '@rnmapbox/maps'

import MapboxGl from '@/components/Mapbox/Mapbox'

import { ActionType, RestAction, RestActionFull } from '@/services/actions/schema'
import { hasValidActionCoordinates } from '@/services/actions/selectors'

import pinBoitage from '../../../assets/map/action-boitage.png'
import pinCollage from '../../../assets/map/action-collage.png'
import pinPap from '../../../assets/map/action-porte-a-porte.png'
import pinQuestionnaire from '../../../assets/map/action-questionnaire.png'
import pinTractage from '../../../assets/map/action-tractage.png'
import { createActionMapSource } from '@/features/actions/pages/detail/helpers/mapSource'
import { ActionMapPlaceholder } from './ActionSkeleton'

const ACTION_DETAIL_MAP_IMAGES = {
  'action-detail-pap': pinPap,
  'action-detail-boitage': pinBoitage,
  'action-detail-tractage': pinTractage,
  'action-detail-collage': pinCollage,
  'action-detail-questionnaire': pinQuestionnaire,
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
  ActionType.QUESTIONNAIRE,
  'action-detail-questionnaire',
  'action-detail-tractage',
] as const

type ActionDetailMapProps = {
  action: RestAction | RestActionFull
  cameraPadding?: CameraPadding
}

type ActionDetailMapBlockProps = {
  action: RestAction | RestActionFull
}

export function ActionDetailMap({ action, cameraPadding }: ActionDetailMapProps) {
  const media = useMedia()
  const shape = useMemo(() => createActionMapSource([action as RestAction], action.uuid), [action])
  const center: [number, number] = [action.post_address.longitude, action.post_address.latitude]
  const cameraKey = `${action.uuid}-${center[0]}-${center[1]}`

  const mobileSnapCamera = media.sm ? ({ animationMode: 'moveTo' as const, animationDuration: 0 } as const) : undefined

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
      <MapboxGl.Camera
        key={cameraKey}
        followUserLocation={false}
        centerCoordinate={center}
        zoomLevel={15}
        padding={cameraPadding}
        {...mobileSnapCamera}
      />
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

export function ActionDetailMapFrame({ children, baseHeight, topInset = 0 }: { children: React.ReactNode; baseHeight: number; topInset?: number }) {
  return (
    <YStack
      height={baseHeight + topInset}
      width="100%"
      flexShrink={0}
      overflow="hidden"
      position="relative"
      borderRadius={0}
      marginTop={topInset ? -topInset : 0}
    >
      {children}
    </YStack>
  )
}

export function ActionDetailMapBlock({ action }: ActionDetailMapBlockProps) {
  const media = useMedia()
  const insets = useSafeAreaInsets()
  const baseHeight = media.sm ? 250 : 300
  const showMap = hasValidActionCoordinates(action.post_address)

  if (media.sm) {
    const top = insets.top
    const cameraPadding: CameraPadding = {
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: top,
      paddingBottom: 0,
    }

    return (
      <ActionDetailMapFrame baseHeight={baseHeight} topInset={top}>
        {showMap ? <ActionDetailMap action={action} cameraPadding={cameraPadding} /> : <ActionMapPlaceholder />}
      </ActionDetailMapFrame>
    )
  }

  return (
    <ActionDetailMapFrame baseHeight={baseHeight}>
      {showMap ? <ActionDetailMap action={action} /> : <ActionMapPlaceholder />}
    </ActionDetailMapFrame>
  )
}
