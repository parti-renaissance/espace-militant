import React from 'react'
import { FlatList, ListRenderItemInfo, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { Colors, Spacing, Typography } from '../../styles'
import i18n from '../../utils/i18n'
import { StatefulView } from '../shared/StatefulView'
import HomeRetaliationCard from './RetaliationListCard'
import { RetaliationListCardViewModel } from './RetaliationListCardViewModel'
import { useRetaliationsScreen } from './useRetaliationsScreen.hook'

export const RetaliationsScreen = () => {
  const { statefulState, isRefreshing, onRefresh, onRetaliateSelected, onRetaliationSelected } = useRetaliationsScreen()

  const renderItem = ({ item }: ListRenderItemInfo<RetaliationListCardViewModel>) => {
    return <HomeRetaliationCard viewModel={item} onRetaliateSelected={onRetaliateSelected} onRetaliationSelected={onRetaliationSelected} />
  }

  const RetaliationsContent = (content: Array<RetaliationListCardViewModel>) => {
    return (
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={content}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={<Text style={styles.title}>{i18n.t('retaliations.title')}</Text>}
        ListEmptyComponent={<Text style={styles.empty}>{i18n.t('retaliations.empty')}</Text>}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[Colors.primaryColor]} />}
      />
    )
  }

  return (
    <View style={styles.container}>
      <StatefulView state={statefulState} contentComponent={RetaliationsContent} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.margin,
  },
  empty: {
    ...Typography.body,
    color: Colors.darkText,
    marginTop: Spacing.margin,
  },
  title: {
    ...Typography.highlightedLargeTitle,
    marginBottom: Spacing.mediumMargin,
    marginTop: Spacing.margin,
  },
})
