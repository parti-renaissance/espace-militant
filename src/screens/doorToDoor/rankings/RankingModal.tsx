import React, { FC, useEffect, useState } from 'react'
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DoorToDoorCampaignRanking } from '../../../core/entities/DoorToDoorCampaignRanking'
import { GetDoorToDoorCampaignInfoInteractor } from '../../../core/interactor/GetDoorToDoorCampaignInfoInteractor'
import { Colors, Typography } from '../../../styles'
import i18n from '../../../utils/i18n'
import { CloseButton } from '../../shared/NavigationHeaderButton'
import { DoorToDoorCampaignCardViewModel } from '../DoorToDoorCampaignCardViewModel'
import { DoorToDoorCampaignCardViewModelMapper } from '../DoorToDoorCampaignCardViewModelMapper'
import { RankingRowViewModel, Tab } from './Ranking'
import { RankingCampaignHeader } from './RankingCampaignHeader'
import { RankingHeaderView } from './RankingHeaderView'
import { RankingRowView } from './RankingRowView'
import { RankingTabsView } from './RankingTabsView'
import { RankingViewModelMapper } from './RankingViewModelMapper'

type Props = Readonly<{
  onDismissModal: () => void
  campaignId: string
}>

const RankingModal: FC<Props> = (props) => {
  const [tab, setTab] = useState(Tab.INDIVIDUAL)
  const [ranking, setRanking] = useState<DoorToDoorCampaignRanking>()
  const [viewModel, setViewModel] = useState<DoorToDoorCampaignCardViewModel>()

  useEffect(() => {
    new GetDoorToDoorCampaignInfoInteractor()
      .execute(props.campaignId)
      .then((result) => {
        setRanking(result.ranking)
        setViewModel(DoorToDoorCampaignCardViewModelMapper.map(result))
      })
  }, [props.campaignId])

  const renderItem = ({ item }: ListRenderItemInfo<RankingRowViewModel>) => (
    <RankingRowView viewModel={item} />
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <CloseButton onPress={props.onDismissModal} />
        <Text style={styles.headerTitle}>
          {i18n.t('doorToDoor.ranking.title')}
        </Text>
      </View>
      {viewModel ? <RankingCampaignHeader viewModel={viewModel} /> : null}
      <RankingTabsView tab={tab} onPress={setTab} />

      <FlatList
        ListHeaderComponent={() => <RankingHeaderView tab={tab} />}
        data={RankingViewModelMapper.map(ranking, tab)}
        renderItem={renderItem}
        keyExtractor={(item) => item.rank}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    ...Typography.title2,
    textAlign: 'center',
  },
})

export default RankingModal
