import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'
import MapView from 'react-native-map-clustering'
import { LatLng, Region } from 'react-native-maps'
import { DoorToDoorAddress } from '../../core/entities/DoorToDoor'
import { Colors, Spacing, Typography } from '../../styles'
import { DoorToDoorCampaignCard } from './DoorToDoorCampaignCard'
import { DoorToDoorCampaignCardViewModelMapper } from './DoorToDoorCampaignCardViewModelMapper'
import { DoorToDoorMapCluster } from './DoorToDoorMapCluster'
import { PoiAddressCard } from './PoiAddressCard'
import { PoiAddressCardViewModelMapper } from './PoiAddressCardViewModelMapper'
import Geolocation from 'react-native-geolocation-service'
import { GetDoorToDoorCampaignInfoInteractor } from '../../core/interactor/GetDoorToDoorCampaignInfoInteractor'
import { DoorToDoorCampaignCardViewModel } from './DoorToDoorCampaignCardViewModel'
import MapButton from './DoorToDoorMapButton'
import Map from 'react-native-maps'
import { DoorToDoorMapMarker } from './DoorToDoorMapMarker'

const DEFAULT_DELTA = 0.01

type Props = {
  data: DoorToDoorAddress[]
  initialLocation: LatLng
  loading: boolean
  onAddressPress: (id: string) => void
  onSearchNearby: (location: LatLng) => void
  onCampaignRankingSelected: (campaignId: string) => void
}

type PopupProps = {
  visible: boolean
  value?: DoorToDoorAddress
}

const DoorToDoorMapView = ({
  data,
  initialLocation,
  loading,
  onAddressPress,
  onSearchNearby,
  onCampaignRankingSelected,
}: Props) => {
  const mapRef = useRef<Map | null>(null)
  const [currentPosition, setCurrentPosition] = useState<LatLng>()
  const [popup, setPopup] = useState<PopupProps>({
    visible: false,
    value: undefined,
  })
  const [currentRegion, setCurrentRegion] = useState<Region>()

  const getRegionFromLatLng = (location: LatLng) => {
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: DEFAULT_DELTA,
      longitudeDelta: DEFAULT_DELTA,
    }
  }

  const moveToCurrentPositionRegion = () => {
    if (mapRef.current !== null && currentPosition) {
      mapRef.current?.animateToRegion(
        getRegionFromLatLng({
          longitude: currentPosition.longitude,
          latitude: currentPosition.latitude,
        }),
        1000,
      )
    }
  }

  useEffect(() => {
    const watchID = Geolocation.watchPosition((position) => {
      setCurrentPosition({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      })
    })

    return () => {
      watchID != null && Geolocation.clearWatch(watchID)
    }
  }, [])

  const onMarkerPress = (poi: DoorToDoorAddress) => {
    setPopup({
      visible: true,
      value: poi,
    })
  }

  const Popup = () => {
    const [
      viewModel,
      setViewModel,
    ] = useState<DoorToDoorCampaignCardViewModel>()

    useEffect(() => {
      if (popup.value) {
        new GetDoorToDoorCampaignInfoInteractor()
          .execute(popup.value?.building.campaignStatistics.campaignId)
          .then((result) => {
            setViewModel(DoorToDoorCampaignCardViewModelMapper.map(result))
          })
      }
    }, [])

    return (
      <Pressable
        style={styles.popupWrap}
        onPress={() => setPopup({ visible: false })}
      >
        <Pressable style={styles.popup}>
          <PoiAddressCard
            onPress={onAddressPress}
            viewModel={PoiAddressCardViewModelMapper.map(popup.value)}
          />
          {viewModel ? (
            <DoorToDoorCampaignCard
              viewModel={viewModel}
              onPress={(campaignId: string) => {
                onCampaignRankingSelected(campaignId)
              }}
            />
          ) : null}
        </Pressable>
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={getRegionFromLatLng(initialLocation)}
        rotateEnabled={false}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsPointsOfInterest={true}
        showsCompass={false}
        showsBuildings={true}
        showsIndoors={false}
        pitchEnabled={false}
        loadingEnabled={true}
        spiralEnabled={false}
        renderCluster={(cluster) => (
          <DoorToDoorMapCluster key={cluster.id} {...cluster} />
        )}
        onRegionChangeComplete={(region: Region) => {
          setCurrentRegion(region)
        }}
        // Android only
        toolbarEnabled={false}
        // iOS only
        showsScale={true}
        // Clustering
        minPoints={6}
        nodeSize={8} // performance optimization
      >
        {data.map((marker) => (
          <DoorToDoorMapMarker
            key={marker.id}
            icon={PoiAddressCardViewModelMapper.map(marker)?.mapStatusIcon}
            coordinate={{
              longitude: marker.longitude,
              latitude: marker.latitude,
            }}
            onPress={() => onMarkerPress(marker)}
          />
        ))}
      </MapView>
      <View style={styles.childContainer}>
        <View style={styles.mapButtonListContainer}>
          <View style={styles.mapButtonSideContainer} />
          <MapButton
            onPress={() => {
              if (currentRegion) {
                onSearchNearby({
                  latitude: currentRegion.latitude,
                  longitude: currentRegion.longitude,
                })
              }
            }}
            text="Rechercher dans la zone"
            image={require('./../../assets/images/loopArrow.png')}
            disabled={loading}
          />
          <View style={styles.mapButtonSideContainer}>
            <MapButton
              style={styles.mapButtonLocation}
              onPress={moveToCurrentPositionRegion}
              image={require('./../../assets/images/gpsPosition.png')}
            />
          </View>
        </View>
      </View>
      {popup.visible && <Popup />}
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
    width: Dimensions.get('window').width,
  },
  popupWrap: {
    alignItems: 'center',
    bottom: 0,
    height: '100%',
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
