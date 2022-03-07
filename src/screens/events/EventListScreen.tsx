import React, { FC } from 'react'
import {
  SectionList,
  StyleSheet,
  SectionListRenderItemInfo,
  Text,
  ListRenderItemInfo,
  View,
  RefreshControl,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { EventMode } from '../../core/entities/Event'
import { Colors, Spacing, Typography } from '../../styles'
import i18n from '../../utils/i18n'
import { StatefulView } from '../shared/StatefulView'
import EventGridItem from './EventGridItem'
import EventView from './EventView'
import {
  EventSectionViewModel,
  EventRowContainerViewModel,
  EventRowViewModel,
} from './EventViewModel'
import { ListFooterLoader } from '../shared/ListFooterLoader'
import { useEventListScreen } from './useEventListScreen.hook'
import { useOnFocus } from '../../utils/useOnFocus.hook'
import { EventFilter } from './EventFilter'

type Props = Readonly<{
  eventFilter: EventFilter
  searchText?: string
  eventModeFilter?: EventMode
}>

const EventListScreen: FC<Props> = ({
  eventFilter,
  searchText,
  eventModeFilter,
}) => {
  const {
    statefulState,
    isLoadingMore,
    isRefreshing,
    onRefresh,
    onEndReached,
    onEventSelected,
  } = useEventListScreen(eventFilter, searchText, eventModeFilter)

  useOnFocus(onRefresh)

  const EventListContent = (events: Array<EventSectionViewModel>) => {
    const renderItemHorizontal = (
      info: ListRenderItemInfo<EventRowViewModel>,
      totalItemCount: number,
    ) => {
      const isLastItem = info.index + 1 === totalItemCount
      const marginEnd = isLastItem ? Spacing.margin : 0
      return (
        <EventGridItem
          style={[styles.eventGridCell, { marginEnd }]}
          viewModel={info.item}
          onEventSelected={onEventSelected}
        />
      )
    }
    const renderItem = ({
      item,
    }: SectionListRenderItemInfo<EventRowContainerViewModel>) => {
      switch (item.type) {
        case 'grouped':
          return (
            <FlatList
              horizontal={true}
              data={item.value.events}
              renderItem={(info) =>
                renderItemHorizontal(info, item.value.events.length)
              }
            />
          )
        case 'event':
          return (
            <EventView
              style={styles.eventView}
              viewModel={item.value}
              onEventSelected={onEventSelected}
            />
          )
      }
    }
    return (
      <SectionList
        stickySectionHeadersEnabled={false}
        sections={events}
        renderItem={renderItem}
        renderSectionHeader={({ section: { sectionViewModel } }) => {
          return sectionViewModel !== undefined ? (
            <Text style={styles.section}>{sectionViewModel.sectionName}</Text>
          ) : null
        }}
        ListFooterComponent={isLoadingMore ? <ListFooterLoader /> : null}
        keyExtractor={(item) => {
          switch (item.type) {
            case 'event':
              return item.value.id
            case 'grouped':
              return item.value.events[0]?.id
          }
        }}
        ListEmptyComponent={() => {
          return (
            <View style={styles.emptyTextContainer}>
              <Text style={styles.emptyText}>{i18n.t('events.empty')}</Text>
            </View>
          )
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors.primaryColor]}
          />
        }
        contentContainerStyle={styles.contentContainerStyle}
        onEndReachedThreshold={0.8}
        onEndReached={onEndReached}
      />
    )
  }

  return (
    <StatefulView
      state={statefulState}
      contentComponent={(viewModel) => {
        return EventListContent(viewModel)
      }}
    />
  )
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
  emptyText: {
    ...Typography.body,
  },
  emptyTextContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.margin,
  },
  eventGridCell: {
    marginStart: Spacing.margin,
    marginVertical: Spacing.margin,
  },
  eventView: {
    marginHorizontal: Spacing.margin,
    marginVertical: Spacing.unit,
  },
  section: {
    ...Typography.title3,
    color: Colors.titleText,
    marginBottom: Spacing.unit,
    marginHorizontal: Spacing.margin,
    marginTop: Spacing.mediumMargin,
  },
})

export default EventListScreen
