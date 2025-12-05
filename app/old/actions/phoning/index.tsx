import React, { useCallback, useState } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native'
import { PhoningCampaign } from '@/core/entities/PhoningCampaign'
import { PhoningCharterNotAccepted, PhoningCharterState } from '@/core/entities/PhoningCharterState'
import PhoningCampaignRepository from '@/data/PhoningCampaignRepository'
import { useCampaignStore, useCharterStore } from '@/data/store/phoning'
import PhoningCallContactRow from '@/screens/phoning/callContact/CallContactRow'
import PhoningCampaignRow from '@/screens/phoning/campaign/PhoningCampaignRow'
import { PhoningRowViewModel } from '@/screens/phoning/PhoningRowViewModel'
import { PhoningViewModel } from '@/screens/phoning/PhoningViewModel'
import { PhoningViewModelMapper } from '@/screens/phoning/PhoningViewModelMapper'
import PhoningTutorialRow from '@/screens/phoning/tutorial/PhoningTutorialRow'
import { StatefulView } from '@/screens/shared/StatefulView'
import { ViewState } from '@/screens/shared/ViewState'
import { ViewStateUtils } from '@/screens/shared/ViewStateUtils'
import { Colors, Spacing, Typography } from '@/styles'
import i18n from '@/utils/i18n'
import { useFocusEffect } from '@react-navigation/native'
import { router } from 'expo-router'

export interface PhoningResources {
  campaigns: PhoningCampaign[]
}

const PhoningScreen = () => {
  const [isRefreshing, setRefreshing] = useState(false)
  const [currentResources, setResources] = useState<PhoningResources>({
    campaigns: [],
  })
  const { setCampaign } = useCampaignStore()
  const { setCharter } = useCharterStore()
  const [charterState, setCharterState] = useState<PhoningCharterState | undefined>()
  const [statefulState, setStatefulState] = useState<ViewState<PhoningViewModel>>(ViewState.Loading())

  const fetchData = useCallback(() => {
    setRefreshing(true)
    PhoningCampaignRepository.getInstance()
      .getPhoningCampaigns()
      .then((campaigns) => {
        setResources({ campaigns: campaigns })
        const viewModel = PhoningViewModelMapper.map(campaigns)
        setStatefulState(ViewState.Content(viewModel))
      })
      .catch((error) => {
        setStatefulState(
          ViewStateUtils.networkError(error, () => {
            setStatefulState(ViewState.Loading())
            fetchData()
          }),
        )
      })
      .finally(() => {
        setRefreshing(false)
      })
  }, [setResources, setStatefulState])

  const fetchCharterState = useCallback(() => {
    PhoningCampaignRepository.getInstance()
      .getPhoningCharterState()
      .then((state) => {
        setCharterState(state)
      })
      .catch(() => {
        setCharterState(undefined)
      })
  }, [])

  const findCampaignInCurrentResources = (id: string) => {
    return currentResources?.campaigns.find((campaign) => campaign.id === id)
  }

  const navigateToCampaign = (campaign: PhoningCampaign) => {
    setCampaign(campaign)
    if (charterState instanceof PhoningCharterNotAccepted) {
      setCharter(charterState.charter)
      router.push({
        pathname: '/old/actions/phoning/charter',
      })
    } else {
      router.push({
        pathname: '/old/actions/phoning/campaign/brief',
      })
    }
  }

  const renderItem = ({ item }: ListRenderItemInfo<PhoningRowViewModel>) => {
    if (item.type === 'tutorial') {
      return (
        <PhoningTutorialRow
          onPress={() => {
            router.push('/old/actions/phoning/tutorial')
          }}
        />
      )
    } else if (item.type === 'callContact') {
      return (
        <PhoningCallContactRow
          viewModel={item.value}
          onCallButtonPressed={() => {
            const campaign = findCampaignInCurrentResources(item.value.id)
            if (campaign?.permanent) {
              setCampaign(campaign)
              router.push({
                pathname: '/old/actions/phoning/session/[device]/loader-permanent-campaign',
                params: { device: 'current' }
              })
            }
          }}
        />
      )
    } else if (item.type === 'campaign') {
      return (
        <PhoningCampaignRow
          viewModel={item.value}
          onCallButtonPressed={() => {
            const selectedCampaign = findCampaignInCurrentResources(item.value.id)
            if (selectedCampaign) {
              navigateToCampaign(selectedCampaign)
            }
          }}
          onRankButtonPressed={() => {
            const selectedCampaign = findCampaignInCurrentResources(item.value.id)
            if (selectedCampaign) {
              setCampaign(selectedCampaign)
              router.push('/old/actions/phoning/campaign/scoreboard')
            }
          }}
        />
      )
    }
    return null
  }

  useFocusEffect(
    useCallback(() => {
      fetchCharterState()
      fetchData()
    }, [fetchCharterState, fetchData]),
  )

  const PhoningContent = (phoningViewModel: PhoningViewModel) => {
    return (
      <FlatList
        data={phoningViewModel.rows}
        renderItem={renderItem}
        keyExtractor={(item) => item.value.id}
        refreshing={isRefreshing}
        onRefresh={fetchData}
        ListHeaderComponent={<Text style={styles.title}>{phoningViewModel.title}</Text>}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptySubtitle}>{i18n.t('phoning.subtitle_no_campaigns')}</Text>
          </View>
        }
        contentContainerStyle={styles.contentContainer}
      />
    )
  }
  return <View style={styles.container}>{<StatefulView contentComponent={PhoningContent} state={statefulState} />}</View>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.margin,
  },
  emptyContainer: {
    flex: 1,
    flexGrow: 1,
  },
  emptyImage: {
    alignSelf: 'center',
    flex: 1,
    height: 166,
    resizeMode: 'contain',
  },
  emptySubtitle: {
    ...Typography.body,
  },
  title: {
    ...Typography.highlightedLargeTitle,
    marginBottom: Spacing.mediumMargin,
    marginTop: Spacing.margin,
  },
})

export default PhoningScreen
