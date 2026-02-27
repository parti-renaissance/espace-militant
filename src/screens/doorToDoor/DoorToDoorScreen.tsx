import React, { useCallback, useEffect, useState } from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LatLng, Region } from '@/components/Maps/Maps'
import { useFocusEffect } from '@react-navigation/native'
import * as Geolocation from 'expo-location'
import { DoorToDoorAddress } from '../../core/entities/DoorToDoor'
import { DoorToDoorCharterNotAccepted, DoorToDoorCharterState } from '../../core/entities/DoorToDoorCharterState'
import { GetDoorToDoorAddressesInteractor } from '../../core/interactor/GetDoorToDoorAddressesInteractor'
import DoorToDoorRepository from '../../data/DoorToDoorRepository'
import { Colors, Spacing, Typography } from '../../styles'
import i18n from '../../utils/i18n'
import { LocationManager } from '../../utils/LocationManager'
import LoaderView from '../shared/LoaderView'
import { DoorToDoorDisplayMode, DoorToDoorFilterDisplay } from './DoorToDoor'
import DoorToDoorCharterModal from './DoorToDoorCharterModal'
import DoorToDoorFilter from './DoorToDoorFilter'
import DoorToDoorListView from './DoorToDoorListView'
import DoorToDoorMapView, { getRegionFromLatLng } from './DoorToDoorMapView'
import LocationAuthorization from './LocationAuthorization'
import MapListSwitch from './MapListSwitch'
import RankingModal from './rankings/RankingModal'

export type RankingModalState = Readonly<{
  visible: boolean
  campaignId?: string
}>

const DoorToDoorScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const [rankingModalState, setRankingModalState] = useState<RankingModalState>({ visible: false })
  const [currentSearchRegion, setCurrentSearchRegion] = useState<Region>()
  const [addresses, setAddresses] = useState<DoorToDoorAddress[]>([])
  const [filteredAddresses, setFilteredAddresses] = useState<DoorToDoorAddress[]>([])
  const [locationAuthorized, setLocationAuthorized] = useState<boolean | undefined>()
  const [displayMode, setDisplayMode] = useState<DoorToDoorDisplayMode>('map')
  const [filter, setFilter] = useState<DoorToDoorFilterDisplay>('all')
  const [charterState, setCharterState] = useState<DoorToDoorCharterState | undefined>()

  const fetchCharterState = useCallback(() => {
    DoorToDoorRepository.getInstance()
      .getDoorToDoorCharterState()
      .then((state) => setCharterState(state))
      .catch(() => setCharterState(undefined))
  }, [])

  const fetchAddresses = (region: Region) => {
    setLoading(true)
    new GetDoorToDoorAddressesInteractor()
      .execute(region.latitude, region.longitude, region.latitudeDelta, region.longitudeDelta)
      .then((newAddresses) => {
        setAddresses(newAddresses)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // Check door to door chart acceptance & localization permission
    fetchCharterState()
    getPermissionStatus()
  }, [fetchCharterState])

  useEffect(() => {
    if (!locationAuthorized) return
    ;(async () => {
      setLoading(true)
      const { status } = await Geolocation.requestForegroundPermissionsAsync()
      const position = await Geolocation.getCurrentPositionAsync({
        accuracy: Geolocation.Accuracy.High,
      })
      if (status !== 'granted') {
        setLocationAuthorized(false)
        setLoading(false)
        return
      }
      const latLng = {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      }
      setCurrentSearchRegion(getRegionFromLatLng(latLng))
      setLoading(false)
    })()
  }, [locationAuthorized])

  useFocusEffect(
    useCallback(() => {
      /* When screen is focused and current location change,
       * fetch addresses near current search location.
       */
      if (currentSearchRegion) {
        fetchAddresses(currentSearchRegion)
      }
    }, [currentSearchRegion]),
  )

  useEffect(() => {
    let result: Array<DoorToDoorAddress> = addresses
    if (filter !== 'all') {
      result = addresses.filter((address) => address.building.campaignStatistics && address.building.campaignStatistics.status === filter)
    }
    setFilteredAddresses(result)
  }, [addresses, filter])

  const getPermissionStatus = async () => {
    // Fix LocationManager returning [0;1] instead of boolean
    setLocationAuthorized(Boolean(await LocationManager.permissionStatus()).valueOf())
  }

  const requestPermission = async () => {
    // Fix LocationManager returning [0;1] instead of boolean
    setLocationAuthorized(Boolean(await LocationManager.requestPermission()).valueOf())
  }

  const onFilterChange = (mode: DoorToDoorFilterDisplay) => {
    setFilter(mode)
  }

  const navigateToBuildingDetail = (id: string) => {
    const address = addresses.find((item) => item.id === id)
    if (address?.building.campaignStatistics) {
      navigation.navigate('BuildingDetail', {
        address: address,
      })
    }
  }

  const renderLoading = () => <LoaderView style={styles.loading} />

  const renderAskPersmission = () => <LocationAuthorization onAuthorizationRequest={requestPermission} />

  const renderMap = (initalLocation: LatLng) => (
    <>
      <View style={styles.filter}>
        <DoorToDoorFilter filter={filter} onPress={onFilterChange} />
      </View>
      {displayMode === 'map' ? (
        <DoorToDoorMapView
          data={filteredAddresses}
          initialLocation={initalLocation}
          loading={loading}
          onAddressPress={navigateToBuildingDetail}
          onSearchNearby={(region) => {
            setCurrentSearchRegion(region)
          }}
          onCampaignRankingSelected={(campaignId: string) => {
            setRankingModalState({ visible: true, campaignId: campaignId })
          }}
        />
      ) : (
        <DoorToDoorListView data={filteredAddresses} onAddressPress={navigateToBuildingDetail} />
      )}
    </>
  )

  const renderContent = () => {
    if (typeof locationAuthorized === 'boolean') {
      if (!locationAuthorized) {
        return renderAskPersmission()
      }
      if (!currentSearchRegion) {
        return renderLoading()
      }
      return renderMap(currentSearchRegion)
    } else {
      return renderLoading()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={rankingModalState.visible} animationType="slide">
        {rankingModalState.campaignId ? (
          <RankingModal onDismissModal={() => setRankingModalState({ visible: false })} campaignId={rankingModalState.campaignId} />
        ) : null}
      </Modal>

      {charterState instanceof DoorToDoorCharterNotAccepted && (
        <Modal visible={true} animationType="slide">
          <DoorToDoorCharterModal charter={charterState.charter} onAcceptCharter={fetchCharterState} onDismissModal={() => navigation.goBack()} />
        </Modal>
      )}

      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {i18n.t('doorToDoor.title')}
        </Text>
        {locationAuthorized && <MapListSwitch mode={displayMode} onPress={setDisplayMode} />}
      </View>
      {renderContent()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  filter: {
    height: 52,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.margin,
    marginTop: Spacing.unit,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...Typography.highlightedLargeTitle,
    flex: 1,
  },
})

export default DoorToDoorScreen
