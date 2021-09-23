import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Text, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'

import { PhoningScreenProp, Screen } from '../../navigation'
import { Colors, Spacing, Typography } from '../../styles'
import { useTheme } from '../../themes'
import { StatefulView, ViewState } from '../shared/StatefulView'
import { PhoningRowViewModel } from './PhoningRowViewModel'
import { PhoningViewModel } from './PhoningViewModel'
import { PhoningViewModelMapper } from './PhoningViewModelMapper'
import { useFocusEffect } from '@react-navigation/core'
import PhoningTutorialRow from './tutorial/PhoningTutorialRow'
import PhoningCampaignRepository from '../../data/PhoningCampaignRepository'
import PhoningCallContactRow from './callContact/CallContactRow'
import { PhoningCampaign } from '../../core/entities/PhoningCampaign'
import { GenericErrorMapper } from '../shared/ErrorMapper'
import PhoningCampaignRow from './campaign/PhoningCampaignRow'
import {
  PhoningCharterNotAccepted,
  PhoningCharterState,
} from '../../core/entities/PhoningCharterState'

export interface PhoningResources {
  campaigns: PhoningCampaign[]
}

const PhoningScreen: FunctionComponent<PhoningScreenProp> = ({
  navigation,
}) => {
  const { theme } = useTheme()
  const [isRefreshing, setRefreshing] = useState(false)
  const [currentResources, setResources] = useState<PhoningResources>({
    campaigns: [],
  })
  const [charterState, setCharterState] = useState<
    PhoningCharterState | undefined
  >()
  const [statefulState, setStatefulState] = useState<
    ViewState.Type<PhoningResources>
  >(new ViewState.Loading())

  useEffect(() => {
    // Reload view model (and view) when resources model changes
    if (!currentResources) {
      return
    }
    const viewModel = PhoningViewModelMapper.map(currentResources.campaigns)
    setStatefulState(new ViewState.Content(viewModel))
  }, [theme, currentResources])

  const fetchData = useCallback(() => {
    setRefreshing(true)
    PhoningCampaignRepository.getInstance()
      .getPhoningCampaigns()
      .then((campaigns) => {
        setResources({ campaigns: campaigns })
      })
      .catch((error) => {
        setStatefulState(
          new ViewState.Error(GenericErrorMapper.mapErrorMessage(error), () => {
            setStatefulState(new ViewState.Loading())
            fetchData()
          }),
        )
      })
      .finally(() => {
        setRefreshing(false)
      })
  }, [])

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
    const brief = {
      id: campaign.id,
      title: campaign.title,
      brief: campaign.brief,
    }
    if (charterState instanceof PhoningCharterNotAccepted) {
      navigation.navigate(Screen.phoningCharter, {
        data: {
          id: campaign.id,
          charter: charterState.charter,
          brief: brief,
        },
      })
    } else {
      navigation.navigate(Screen.phoningCampaignBrief, { data: brief })
    }
  }

  const renderItem = ({ item }: ListRenderItemInfo<PhoningRowViewModel>) => {
    if (item.type === 'tutorial') {
      return (
        <PhoningTutorialRow
          onPress={() => {
            navigation.navigate(Screen.phoningTutorial)
          }}
        />
      )
    } else if (item.type === 'callContact') {
      return (
        <PhoningCallContactRow
          viewModel={item.value}
          onCallButtonPressed={() => {
            console.log('should open call screen')
          }}
        />
      )
    } else if (item.type === 'campaign') {
      return (
        <PhoningCampaignRow
          viewModel={item.value}
          onCallButtonPressed={() => {
            const selectedCampaign = findCampaignInCurrentResources(
              item.value.id,
            )
            if (selectedCampaign) navigateToCampaign(selectedCampaign)
          }}
          onRankButtonPressed={() => {
            const selectedCampaign = findCampaignInCurrentResources(
              item.value.id,
            )
            if (selectedCampaign) {
              navigation.navigate(Screen.phoningCampaignScoreboard, {
                data: { scoreboard: selectedCampaign.scoreboard },
              })
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
        ListHeaderComponent={
          <Text style={styles.title}>{phoningViewModel.title}</Text>
        }
        contentContainerStyle={styles.contentContainer}
      />
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      {<StatefulView contentComponent={PhoningContent} state={statefulState} />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.largeMargin,
  },
  title: {
    ...Typography.title,
    marginBottom: Spacing.mediumMargin,
  },
})

export default PhoningScreen
