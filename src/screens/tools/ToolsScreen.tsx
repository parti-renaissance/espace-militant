import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import ToolsRepository from '../../data/ToolsRepository'
import { Colors, Spacing, Typography } from '../../styles'
import i18n from '../../utils/i18n'
import { StatefulView, ViewState } from '../shared/StatefulView'
import { ToolRow } from './ToolRow'
import { ToolRowViewModel } from './ToolRowViewModel'
import { ExternalLink } from '../shared/ExternalLink'
import { ViewStateUtils } from '../shared/ViewStateUtils'
import ToolsContentViewModel from './ToolsContentViewModel'
import { ToolsContentViewModelMapper } from './ToolsContentViewModelMapper'
import { PaginatedResult } from '../../core/entities/PaginatedResult'
import { Tool } from '../../core/entities/Tool'
import { Analytics } from '../../utils/Analytics'
import { ListFooterLoader } from '../shared/ListFooterLoader'

const ToolsScreen = () => {
  const [statefulState, setStatefulState] = useState<
    ViewState<ToolsContentViewModel>
  >(ViewState.Loading())
  const [isLoadingMore, setLoadingMore] = useState(false)
  const fetchTools = async (
    page: number,
  ): Promise<PaginatedResult<Array<Tool>>> => {
    return await ToolsRepository.getInstance().getTools(page)
  }

  const loadFirstPage = () => {
    setStatefulState(ViewState.Loading())
    fetchTools(1)
      .then((paginatedResult) => {
        setStatefulState(
          ViewState.Content(ToolsContentViewModelMapper.map(paginatedResult)),
        )
      })
      .catch((error) => {
        setStatefulState(
          ViewStateUtils.networkError(error, () => loadFirstPage()),
        )
      })
  }

  const loadMore = () => {
    const currentState = statefulState
    if (currentState.state === 'content') {
      const content = currentState.content
      const paginationInfo = content.paginationInfo
      if (paginationInfo.currentPage === paginationInfo.lastPage) {
        // last page reached : nothing to paginate
        return
      }
      setLoadingMore(true)
      fetchTools(paginationInfo.currentPage + 1)
        .then((paginatedResult) => {
          setStatefulState(
            ViewState.Content(
              ToolsContentViewModelMapper.map(paginatedResult, content),
            ),
          )
        })
        .catch((error) => {
          setStatefulState(
            ViewStateUtils.networkError(error, () => loadFirstPage()),
          )
        })
        .finally(() => setLoadingMore(false))
    }
  }

  useEffect(loadFirstPage, [])

  const renderItem = ({ item }: ListRenderItemInfo<ToolRowViewModel>) => {
    return <ToolRow viewModel={item} onPress={onToolSelected} />
  }

  const onToolSelected = async (tool: ToolRowViewModel) => {
    await Analytics.logToolSelected(tool.title)
    ExternalLink.openUrl(tool.url)
  }

  const ToolContent = (content: ToolsContentViewModel) => {
    return (
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={content.rows}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={
          <Text style={styles.title}>{i18n.t('tools.title')}</Text>
        }
        ListFooterComponent={isLoadingMore ? <ListFooterLoader /> : null}
        renderItem={renderItem}
        onEndReachedThreshold={0.8}
        onEndReached={loadMore}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatefulView state={statefulState} contentComponent={ToolContent} />
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
    ...Typography.largeTitle,
    marginBottom: Spacing.mediumMargin,
  },
})

export default ToolsScreen
