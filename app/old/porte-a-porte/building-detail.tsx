import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Modal, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import MobileWallLayout from '@/components/MobileWallLayout/MobileWallLayout'
import { BuildingBlock, BuildingBlockHelper } from '@/core/entities/BuildingBlock'
import { BuildingHistoryPoint } from '@/core/entities/BuildingHistory'
import { BuildingType, DoorToDoorAddress } from '@/core/entities/DoorToDoor'
import { DoorToDoorCampaignInfo, GetDoorToDoorCampaignInfoInteractor } from '@/core/interactor/GetDoorToDoorCampaignInfoInteractor'
import { UpdateBuildingLayoutInteractor } from '@/core/interactor/UpdateBuildingLayoutInteractor'
import DoorToDoorRepository from '@/data/DoorToDoorRepository'
import { useDoorToDoorStore, useDtdTunnelStore } from '@/data/store/door-to-door'
import { BuildingDetailScreenViewModelMapper } from '@/screens/buildingDetail/BuildingDetailScreenViewModelMapper'
import BuildingLayoutView from '@/screens/buildingDetail/BuildingLayoutView'
import BuildingVisitsHistoryView from '@/screens/buildingDetail/BuildingVisitsHistoryView'
import BuildingStatusView from '@/screens/buildingDetail/BuilidingStatusView'
import { DoorToDoorCampaignInfoView } from '@/screens/doorToDoor/DoorToDoorCampaignCard'
import { DoorToDoorCampaignCardViewModel } from '@/screens/doorToDoor/DoorToDoorCampaignCardViewModel'
import { DoorToDoorCampaignCardViewModelMapper } from '@/screens/doorToDoor/DoorToDoorCampaignCardViewModelMapper'
import { RankingModalState } from '@/screens/doorToDoor/DoorToDoorScreen'
import RankingModal from '@/screens/doorToDoor/rankings/RankingModal'
import { AlertUtils } from '@/screens/shared/AlertUtils'
import CardView from '@/screens/shared/CardView'
import LoadingOverlay from '@/screens/shared/LoadingOverlay'
import { NavigationHeaderButton } from '@/screens/shared/NavigationHeaderButton'
import { TouchablePlatform } from '@/screens/shared/TouchablePlatform'
import { Colors, Spacing, Styles, Typography } from '@/styles'
import { margin, mediumMargin } from '@/styles/spacing'
import AlphabetHelper from '@/utils/AlphabetHelper'
import i18n from '@/utils/i18n'
import { useIsFocused } from '@react-navigation/native'
import { router, useNavigation } from 'expo-router'
import { isWeb } from 'tamagui'

enum Tab {
  HISTORY,
  LAYOUT,
}

const BuildingDetailScreen = () => {
  const isFocused = useIsFocused()
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tab, setTab] = useState(Tab.LAYOUT)
  const [history, setHistory] = useState<BuildingHistoryPoint[]>([])
  const [layout, setLayout] = useState<BuildingBlock[]>([])
  const [campaignCardViewModel, setCampaignCardViewModel] = useState<DoorToDoorCampaignCardViewModel>()
  const dtdStore = useDoorToDoorStore()
  const { setTunnel } = useDtdTunnelStore()
  const [address, setAddress] = useState(dtdStore.address as DoorToDoorAddress)
  const [rankingModalState, setRankingModalState] = useState<RankingModalState>({ visible: false })
  const viewModel = BuildingDetailScreenViewModelMapper.map(address!, history, layout)
  const buildingBlockHelper = new BuildingBlockHelper()
  const campaignStatistics = address!.building.campaignStatistics!

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <NavigationHeaderButton source={require('@/assets/images/edit.png')} onPress={changeBuildingType} style={styles.edit} />,
    })
  })

  const fetchLayout = async (): Promise<Array<BuildingBlock>> => {
    if (!dtdStore.address) {
      throw new Error('No address found')
    }
    return await new UpdateBuildingLayoutInteractor().execute(
      dtdStore.address.building.id,
      campaignStatistics.campaignId,
      dtdStore.address.building.type,
      layout,
    )
  }

  const fetchHistory = async (): Promise<Array<BuildingHistoryPoint>> => {
    if (!dtdStore.address) {
      throw new Error('No address found')
    }
    return await DoorToDoorRepository.getInstance().buildingHistory(dtdStore.address.building.id, campaignStatistics.campaignId)
  }

  const fetchCampaignInfo = async (): Promise<DoorToDoorCampaignInfo> => {
    return await new GetDoorToDoorCampaignInfoInteractor().execute(campaignStatistics.campaignId)
  }

  const fetchAddress = async (): Promise<DoorToDoorAddress | null> => await DoorToDoorRepository.getInstance().getAddress(address.id)

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      const newBlocks = await fetchLayout()
      setLayout(newBlocks)
      const freshAddress = await fetchAddress()
      if (freshAddress) {
        setAddress(freshAddress)
      }
      const freshHistory = await fetchHistory()
      setHistory(freshHistory)
      const freshCampaignInfo = await fetchCampaignInfo()
      setCampaignCardViewModel(DoorToDoorCampaignCardViewModelMapper.map(freshCampaignInfo))
    } catch (error) {
      // noop
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (isFocused) {
      refreshData()
    }
  }, [isFocused])

  const showHistory = () => {
    setTab(Tab.HISTORY)
  }

  const showLayout = () => {
    setTab(Tab.LAYOUT)
  }

  const addNewBuildingBlock = () => {
    let nextBuildingBlock: string
    if (layout.length > 0) {
      nextBuildingBlock = AlphabetHelper.nextLetterInAlphabet(layout[layout.length - 1].name)
    } else {
      nextBuildingBlock = AlphabetHelper.firstLetterInAlphabet
    }
    layout.push(buildingBlockHelper.createLocalBlock(nextBuildingBlock, address.building.type))
    setLayout([...layout])
  }

  const addNewBuildingFloor = (buildingBlockId: string) => {
    const block = layout.find((item) => item.id === buildingBlockId)
    if (block) {
      const nextFloor = (block.floors[block.floors.length - 1]?.number ?? 0) + 1
      block.floors.push(buildingBlockHelper.createLocalFloor(nextFloor))
      setLayout([...layout])
    }
  }

  const removeBuildingBlock = (buildingBlockId: string) => {
    const block = layout.find((item) => item.id === buildingBlockId)
    if (block) {
      const index = layout.indexOf(block, 0)
      if (index > -1) {
        layout.splice(index, 1)
        setLayout([...layout])
      }
    }
  }

  const removeBuildingFloor = (buildingBlockId: string, floorNumber: number) => {
    const block = layout.find((item) => item.id === buildingBlockId)
    const floor = block?.floors?.find((item) => item.number === floorNumber)
    if (block && floor) {
      const index = block.floors.indexOf(floor, 0)
      block.floors.splice(index, 1)
      setLayout([...layout])
    }
  }

  const handleBuildingAction = (buildingBlockId: string) => {
    const block = layout.find((item) => item.id === buildingBlockId)
    if (!block) return
    if (block.status === 'completed') {
      setIsLoading(true)
      DoorToDoorRepository.getInstance()
        .openBuildingBlock(campaignStatistics.campaignId, address.building.id, block.name)
        .then(() => refreshData())
        .finally(() => setIsLoading(false))
    } else {
      AlertUtils.showDestructiveAlert(
        i18n.t('building.layout.close_building_alert.title'),
        i18n.t('building.layout.close_building_alert.message'),
        i18n.t('building.layout.close_building_alert.action'),
        i18n.t('building.layout.close_building_alert.cancel'),
        () => {
          setIsLoading(true)
          DoorToDoorRepository.getInstance()
            .closeBuildingBlock(campaignStatistics.campaignId, address.building.id, block.name)
            .then(() => refreshData())
            .finally(() => setIsLoading(false))
        },
      )
    }
  }

  const changeBuildingType = () => {
    AlertUtils.showSimpleAlert(
      i18n.t('building.change_type_alert.title'),
      address.building.type === 'building' ? i18n.t('building.change_type_alert.message.building') : i18n.t('building.change_type_alert.message.house'),
      i18n.t('building.change_type_alert.action'),
      i18n.t('building.change_type_alert.cancel'),
      () => {
        setIsLoading(true)
        let newBuildingType: BuildingType
        if (address.building.type === 'house') {
          newBuildingType = 'building'
        } else {
          newBuildingType = 'house'
        }
        DoorToDoorRepository.getInstance()
          .updateBuildingType(address.building.id, newBuildingType)
          .then(refreshData)
          .finally(() => setIsLoading(false))
      },
    )
  }

  const closeAddress = () => {
    AlertUtils.showDestructiveAlert(
      i18n.t('building.close_address.alert.title'),
      i18n.t('building.close_address.alert.message'),
      i18n.t('building.close_address.alert.action'),
      i18n.t('building.close_address.alert.cancel'),
      () => {
        setIsLoading(true)
        DoorToDoorRepository.getInstance()
          .closeBuilding(campaignStatistics.campaignId, address.building.id)
          .then(() => {
            refreshData()
          })
          .finally(() => setIsLoading(false))
      },
    )
  }

  const handleLeaflet = (n: number) => {
    AlertUtils.showDestructiveAlert(
      i18n.t('building.close_address.alert.title'),
      i18n.t('building.close_address.alert.message'),
      i18n.t('building.close_address.alert.action'),
      i18n.t('building.close_address.alert.cancel'),
      () => {
        setIsLoading(true)
        DoorToDoorRepository.getInstance()
          .sendLeaflet(campaignStatistics.campaignId, address!.building.id, n)
          .then(() => {
            refreshData()
          })
          .finally(() => setIsLoading(false))
      },
    )
  }

  const openAddress = () => {
    AlertUtils.showSimpleAlert(
      i18n.t('building.open_address.alert.title'),
      i18n.t('building.open_address.alert.message'),
      i18n.t('building.open_address.alert.action'),
      i18n.t('building.open_address.alert.cancel'),
      () => {
        setIsLoading(true)
        DoorToDoorRepository.getInstance()
          .openBuilding(campaignStatistics.campaignId, address.building.id)
          .then(() => {
            refreshData()
          })
          .finally(() => setIsLoading(false))
      },
    )
  }

  const renderTab = (currentTab: Tab) => {
    switch (currentTab) {
      case Tab.HISTORY:
        return <BuildingVisitsHistoryView viewModel={viewModel.history} />
      case Tab.LAYOUT:
        return (
          <BuildingLayoutView
            viewModel={viewModel.buildingLayout}
            leafletsInfo={{
              leafletsDistributed: viewModel.leafletsDistributed ?? 0,
              lastVisit: viewModel.lastVisit,
            }}
            onSelect={(buildingBlock: string, floorNumber: number) => {
              const block = layout.find((item) => item.name === buildingBlock)
              const floor = block?.floors?.find((item) => item.number === floorNumber)
              let canCloseFloor = false
              let door = 1
              if (block && floor) {
                canCloseFloor = floor.visitedDoors.length > 0
                if (floor.visitedDoors.length === 0) {
                  door = 1
                } else {
                  door = floor.visitedDoors.sort((door1, door2) => door1 - door2)[floor.visitedDoors.length - 1] + 1
                }
              }
              setTunnel({
                campaignId: campaignStatistics.campaignId,
                buildingParams: {
                  id: address.building.id,
                  block: block?.name!,
                  floor: floorNumber,
                  type: address.building.type,
                  door: door,
                },
                canCloseFloor: canCloseFloor,
              })
              router.push({ pathname: '/old/porte-a-porte/tunnel/brief' })
            }}
            onAddBuildingBlock={() => addNewBuildingBlock()}
            onAddBuildingFloor={(buildingBlockId: string) => addNewBuildingFloor(buildingBlockId)}
            onRemoveBuildingBlock={(buildingBlockId: string) => {
              removeBuildingBlock(buildingBlockId)
            }}
            onRemoveBuildingFloor={(buildingBlockId: string, floor: number) => {
              removeBuildingFloor(buildingBlockId, floor)
            }}
            onBuildingAction={(buildingBlockId: string) => {
              handleBuildingAction(buildingBlockId)
            }}
            onOpenAddress={openAddress}
            onCloseAddress={closeAddress}
            onLeaflet={handleLeaflet}
          />
        )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={isLoading} />
      <Modal visible={rankingModalState.visible} animationType="slide">
        {rankingModalState.campaignId ? (
          <RankingModal onDismissModal={() => setRankingModalState({ visible: false })} campaignId={rankingModalState.campaignId} />
        ) : null}
      </Modal>
      <>
        <ScrollView
          keyboardShouldPersistTaps={'always'}
          refreshControl={<RefreshControl refreshing={isRefreshing && !isLoading} onRefresh={refreshData} colors={[Colors.primaryColor]} />}
        >
          {/* <Image source={viewModel.illustration} style={styles.illustration} /> */}
          <Text style={styles.address}>{viewModel.address}</Text>
          <Text style={styles.lastVisit}>{viewModel.lastVisit}</Text>
          <BuildingStatusView viewModel={viewModel.status} />
          {/* The tabbar is simulated here and we are not using TabView from react-native-tab-view
              because we need to be able to scroll through the content of the tabs and react-native-tab-view
              does not provide us with a way to do it. */}
          <View style={styles.tabbarContainer}>
            <TouchablePlatform touchHighlight={Colors.touchHighlight} onPress={showLayout}>
              <View style={tab === Tab.LAYOUT ? styles.selectedTab : styles.tab}>
                <Text style={tab === Tab.LAYOUT ? styles.selectedTabText : styles.tabText}>{i18n.t('building.tabs.layout')}</Text>
              </View>
            </TouchablePlatform>
            <TouchablePlatform touchHighlight={Colors.touchHighlight} onPress={showHistory}>
              <View style={tab === Tab.HISTORY ? styles.selectedTab : styles.tab}>
                <Text style={tab === Tab.HISTORY ? styles.selectedTabText : styles.tabText}>{i18n.t('building.tabs.history')}</Text>
              </View>
            </TouchablePlatform>
          </View>
          {renderTab(tab)}
        </ScrollView>
        {campaignCardViewModel ? (
          <View style={styles.bottomContainer}>
            <CardView backgroundColor={Colors.defaultBackground}>
              <TouchablePlatform
                onPress={() =>
                  setRankingModalState({
                    visible: true,
                    campaignId: campaignCardViewModel.campaignId,
                  })
                }
                touchHighlight={Colors.touchHighlight}
              >
                <DoorToDoorCampaignInfoView viewModel={campaignCardViewModel} />
              </TouchablePlatform>
            </CardView>
          </View>
        ) : null}
      </>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  address: {
    ...Typography.title2,
    marginTop: mediumMargin,
    textAlign: 'center',
  },
  bottomContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  edit: {
    alignSelf: 'flex-end',
    marginEnd: Spacing.unit,
  },
  elevatedContainer: {
    ...Styles.topElevatedContainerStyle,
  },
  illustration: {
    alignSelf: 'center',
  },
  lastVisit: {
    ...Typography.body,
    marginBottom: margin,
    textAlign: 'center',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderColor: Colors.accent,
    margin: margin,
    textAlign: 'center',
  },
  selectedTabText: {
    ...Typography.headline,
  },
  tab: {
    margin: margin,
    textAlign: 'center',
  },
  tabText: {
    ...Typography.thinHeadline,
  },
  tabbarContainer: {
    ...Typography.callout,
    flexDirection: 'row',
    justifyContent: 'center',
  },
})

export default isWeb ? MobileWallLayout : BuildingDetailScreen
