import React from 'react'
import { FlatList, ListRenderItemInfo, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { Colors, Spacing, Typography } from '../../styles'
import i18n from '../../utils/i18n'
import CircularIcon from '../shared/CircularIcon'
import { StatefulView } from '../shared/StatefulView'
import PollRow from './PollRow'
import { PollRowViewModel } from './PollRowViewModel'
import PollsHeader from './PollsHeader'
import { PollsScreenViewModel } from './PollsScreenViewModel'
import { usePollsScreen } from './usePollsScreen.hook'
import { useMedia } from 'tamagui'

const PollsScreen = () => {
  const { statefulState, isRefreshing, onPollSelected, onRefresh } = usePollsScreen()
  const media = useMedia()

  const renderItem = ({ item, index }: ListRenderItemInfo<PollRowViewModel>) => {
      return <PollRow viewModel={item} onPress={() => onPollSelected(item.id)} />
  }

  const PollContent = (viewModel: PollsScreenViewModel) => {
    return (
      <FlatList
        data={viewModel.rows}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<PollsHeader style={styles.header} viewModel={viewModel.header} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <CircularIcon style={styles.emptyIcon} source={require('../../assets/images/emptyPollIcon.png')} />
            <Text style={styles.emptyText}>{i18n.t('polls.subtitle_no_polls')}</Text>
          </View>
        }
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[Colors.primaryColor]} />}
      />
    )
  }

  return (
    <View style={styles.container}>
      {/* {media.sm ? <PageHeader title="Questionnaires" icon={ClipboardCheck} backArrow={false} /> : null} */}
      <StatefulView state={statefulState} contentComponent={PollContent} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9fa',
    flex: 1,
    
  },
  contentContainer: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 520,
    marginHorizontal: 'auto',
    backgroundColor: '#fff',
    marginTop: 40,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 150,
  },
  emptyContainer: {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center',
    padding: Spacing.margin,
  },
  emptyIcon: {
    marginBottom: Spacing.margin,
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
  },
  header: {
    marginBottom: Spacing.margin,
    marginTop: Spacing.margin,
  },
})

export default PollsScreen
