import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'
import Container from '@/components/layouts/Container'
import MapboxGl from '@/components/Mapbox/Mapbox'
import { LatLng, Region } from '@/components/Maps/Maps'
import clientEnv from '@/config/clientEnv'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'
import { Feature, Point } from 'geojson'
import { isWeb, useTheme } from 'tamagui'
import { DoorToDoorAddress, DoorToDoorAddressStatus } from '../../core/entities/DoorToDoor'
import { GetDoorToDoorCampaignInfoInteractor } from '../../core/interactor/GetDoorToDoorCampaignInfoInteractor'
import { Colors, Spacing, Typography } from '../../styles'
import { DoorToDoorCampaignCard } from './DoorToDoorCampaignCard'
import { DoorToDoorCampaignCardViewModel } from './DoorToDoorCampaignCardViewModel'
import { DoorToDoorCampaignCardViewModelMapper } from './DoorToDoorCampaignCardViewModelMapper'
import MapButton from './DoorToDoorMapButton'
import { PoiAddressCard } from './PoiAddressCard'
import { PoiAddressCardViewModelMapper } from './PoiAddressCardViewModelMapper'

import loopArrowImg from './../../assets/images/loopArrow.png'
import gpsPositionImg from './../../assets/images/gpsPosition.png'

MapboxGl.setAccessToken(clientEnv.MAP_BOX_ACCESS_TOKEN)

const DEFAULT_DELTA = 0.01
const prio1 = ['==', ['get', 'score'], 1]
const prio2 = ['==', ['get', 'score'], 2]
const prio3 = ['>=', ['to-number', ['get', 'score']], 3]

const filterClusterScore = ['floor', ['/', ['ceil', ['get', 'score']], ['get', 'point_count']]]

const prioC1 = ['==', filterClusterScore, 1]
const prioC2 = ['==', filterClusterScore, 2]
const prioC3 = ['>=', filterClusterScore, 3]
const colors = ['#919EAB', '#FF462E', '#FF912B', '#FFC700']

const papStatusFilter = (status: DoorToDoorAddressStatus, value: string) => [['==', ['get', 'status'], status], value]

type Props = {
  data: DoorToDoorAddress[]
  initialLocation?: LatLng
  loading: boolean
  onAddressPress: (id: string) => void
  onSearchNearby: (region: Region) => void
  onCampaignRankingSelected: (campaignId: string) => void
}

type PopupState = {
  visible: boolean
  addressId?: string
}

type PopupProps = Readonly<{
  address?: DoorToDoorAddress
  onAddressPress: (id: string) => void
  onCampaignRankingSelected: (campaignId: string) => void
}>

export function getRegionFromLatLng(location: LatLng): Region {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: DEFAULT_DELTA,
    longitudeDelta: DEFAULT_DELTA,
  }
}

const Popup = ({ address, onAddressPress, onCampaignRankingSelected }: PopupProps) => {
  const [viewModel, setViewModel] = useState<DoorToDoorCampaignCardViewModel>()

  useEffect(() => {
    if (address?.building.campaignStatistics) {
      new GetDoorToDoorCampaignInfoInteractor().execute(address.building.campaignStatistics.campaignId).then((result) => {
        setViewModel(DoorToDoorCampaignCardViewModelMapper.map(result))
      })
    }
  }, [address])

  return (
    <Pressable style={styles.popupWrap}>
      <Pressable style={styles.popup}>
        <Container>
          <PoiAddressCard onPress={onAddressPress} viewModel={PoiAddressCardViewModelMapper.map(address)} />
          {viewModel ? (
            <DoorToDoorCampaignCard
              viewModel={viewModel}
              onPress={(campaignId: string) => {
                onCampaignRankingSelected(campaignId)
              }}
            />
          ) : null}
        </Container>
      </Pressable>
    </Pressable>
  )
}

const DoorToDoorMapView = ({ data, loading, onAddressPress, onSearchNearby, onCampaignRankingSelected }: Props) => {
  const mapRef = useRef<MapboxGl.MapView | null>(null)
  const sourceRef = useRef<MapboxGl.ShapeSource | null>(null)
  const cameraRef = useRef<MapboxGl.Camera | null>(null)
  const userLocationRef = useRef<MapboxGl.UserLocation | null>(null)
  const [followUser, setFollowUser] = useState(true)
  const [popup, setPopup] = useState<PopupState>({
    visible: false,
    addressId: undefined,
  })

  const onMarkerPress = (address: DoorToDoorAddress) => {
    setPopup({
      visible: true,
      addressId: address.id,
    })
  }

  const onPress = async (event: OnPressEvent) => {
    if (event.features.length === 0) {
      return
    }
    const [cluster] = event.features as Feature<Point>[]
    if (cluster.properties?.cluster === true && sourceRef.current) {
      setFollowUser(false)
      const expansionZoom = await sourceRef.current.getClusterExpansionZoom(cluster)
      const centerCoordinate = cluster.geometry.coordinates
      const zoomLevel = expansionZoom * 1.1
      cameraRef.current?.setCamera({
        centerCoordinate,
        zoomLevel,
        animationMode: 'easeTo',
        animationDuration: 300,
      })
    } else {
      onMarkerPress(cluster.properties as DoorToDoorAddress)
    }
  }

  const createSource = (data: DoorToDoorAddress[]): MapboxGl.ShapeSource['props']['shape'] => {
    const mapPrio = (x: number | null) => {
      return x ?? 0
    }

    return {
      type: 'FeatureCollection',
      features: data.map(({ priority, ...rest }) => ({
        type: 'Feature',
        properties: {
          ...rest,
          status: rest.building.campaignStatistics?.status,
          score: mapPrio(priority),
        },
        geometry: {
          type: 'Point',
          coordinates: [rest.longitude, rest.latitude],
        },
      })),
    }
  }

  const theme = useTheme()

  const memoizedSource = useMemo(() => createSource(data), [data])
  return (
    <View style={styles.container}>
      <MapboxGl.MapView
        style={styles.map}
        ref={mapRef}
        pitchEnabled={false}
        onPress={() => setPopup({ visible: false })}
        styleURL="mapbox://styles/larem/clwaph1m1008501pg1cspgbj2"
      >
        <MapboxGl.Camera ref={cameraRef} followUserLocation={followUser} followUserMode={MapboxGl.UserTrackingMode.Follow} followZoomLevel={18} />
        <MapboxGl.UserLocation visible={true} ref={userLocationRef} />
        <MapboxGl.ShapeSource
          shape={memoizedSource}
          id="source-addresses"
          ref={sourceRef}
          cluster={true}
          clusterRadius={35}
          clusterMaxZoomLevel={18}
          clusterProperties={{
            score: ['+', ['get', 'score']],
          }}
          onPress={onPress}
          hitbox={{ width: 20, height: 20 }}
        >
          <MapboxGl.CircleLayer
            id="layer-addresses-cluster"
            filter={['has', 'point_count']}
            style={{
              circleRadius: ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
              circleColor: ['case', prioC1, colors[1], prioC2, colors[2], prioC3, colors[3], colors[0]],
              circleOpacity: 0.6,
              circleStrokeColor: 'white',
              circleStrokeWidth: 2,
            }}
          />

          <MapboxGl.SymbolLayer
            id="layer-addresses-cluster-count"
            filter={['has', 'point_count']}
            style={{
              textField: ['to-string', ['get', 'point_count']],
              textSize: 12,
              textColor: 'white',
            }}
          />

          <MapboxGl.CircleLayer
            id="layer-addresses"
            filter={['!', ['has', 'point_count']]}
            circle-sort-key={['case', ['has', 'score'], 100, 0]}
            style={{
              circleRadius: 15,
              circleColor: ['case', ...papStatusFilter('completed', '#DFE3E8'), prio1, colors[1], prio2, colors[2], prio3, colors[3], colors[0]],
              circleStrokeColor: ['case', ...papStatusFilter('completed', theme.textPrimary.val), 'white'],
              circleStrokeWidth: 2,
            }}
          />
          <MapboxGl.SymbolLayer
            id="layer-addresses-status"
            filter={['!', ['has', 'point_count']]}
            style={{
              textField: ['case', ...papStatusFilter('ongoing', '•••'), ...papStatusFilter('completed', '✓'), ''],
              textSize: 12,
              textColor: ['case', ...papStatusFilter('completed', theme.textPrimary.val), 'white'],
            }}
          />
        </MapboxGl.ShapeSource>
      </MapboxGl.MapView>

      <View style={styles.childContainer}>
        <View style={styles.mapButtonListContainer}>
          <View style={styles.mapButtonSideContainer} />
          <MapButton
            onPress={async () => {
              const region = (await mapRef.current?.getCenter())!
              onSearchNearby(
                getRegionFromLatLng({
                  longitude: region[0],
                  latitude: region[1],
                }),
              )
            }}
            text="Rechercher dans la zone"
            image={loopArrowImg}
            disabled={loading}
          />
          <View style={styles.mapButtonSideContainer}>
            {!isWeb && (
              <MapButton
                style={styles.mapButtonLocation}
                onPress={() => {
                  setFollowUser(false)

                  cameraRef.current?.setCamera({
                    centerCoordinate: userLocationRef.current?.state.coordinates ?? undefined,
                    animationMode: 'easeTo',
                    animationDuration: 300,
                  })
                  setTimeout(() => {
                    setFollowUser(true)
                  }, 300)
                }}
                image={gpsPositionImg}
              />
            )}
          </View>
        </View>
      </View>
      {popup.visible && (
        <Popup
          address={popup.addressId ? data.find((address) => address.id === popup.addressId) : undefined}
          onAddressPress={onAddressPress}
          onCampaignRankingSelected={onCampaignRankingSelected}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  childContainer: {
    position: 'absolute',
    width: '100%',
  },
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapButtonIcon: {
    alignSelf: 'center',
    height: 16,
    width: 16,
  },
  mapButtonListContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: Spacing.margin,
  },
  mapButtonLocation: {
    alignSelf: 'flex-end',
    height: 40,
    width: 40,
  },
  mapButtonSideContainer: {
    flex: 1,
  },
  mapButtonText: {
    ...Typography.callout,
    alignSelf: 'center',
    marginLeft: Spacing.small,
    textAlign: 'center',
  },
  popup: {
    marginBottom: Spacing.unit,
    width: '100%',
    flex: 1,
  },
  popupWrap: {
    alignItems: 'center',
    bottom: 0,
    // height: '100%',
    justifyContent: 'flex-end',
    position: 'absolute',
    width: Dimensions.get('window').width,
  },
  searchHereButton: {
    borderRadius: 20,
    flex: 0,
    overflow: 'hidden',
  },
  searchHereButtonContainer: {
    backgroundColor: Colors.defaultBackground,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 40,
    padding: Spacing.unit,
  },
})

export default DoorToDoorMapView
