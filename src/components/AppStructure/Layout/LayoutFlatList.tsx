import React, { useCallback } from 'react'
import { FlatList, FlatListProps, Platform, RefreshControl } from 'react-native'
import { isWeb } from 'tamagui'
import { usePageLayoutScroll } from '@/components/AppStructure/hooks/usePageLayoutScroll'
import useLayoutSpacing, { type UseLayoutSpacingOptions } from '@/components/AppStructure/hooks/useLayoutSpacing'

type LayoutFlatListProps<T> = Omit<FlatListProps<T>, 'onEndReached' | 'data' | 'renderItem' | 'refreshControl'> & {
  data: FlatListProps<T>['data']
  renderItem: FlatListProps<T>['renderItem']
  onEndReached?: () => void
  onEndReachedThreshold?: number
  hasMore?: boolean
  padding?: UseLayoutSpacingOptions
  refreshing?: boolean
  onRefresh?: () => void
  refreshControl?: React.ReactElement
}

function LayoutFlatListInner<T>(
  {
    onEndReached,
    onEndReachedThreshold = 0.4,
    hasMore = false,
    padding = true,
    data,
    renderItem,
    contentContainerStyle,
    refreshing,
    onRefresh,
    refreshControl,
    ...rest
  }: LayoutFlatListProps<T>,
  ref: React.Ref<FlatList<T>>
) {
  const spacingValues = useLayoutSpacing(padding)

  const loadMore = useCallback(() => {
    if (onEndReached && hasMore) {
      onEndReached()
    }
  }, [hasMore, onEndReached])

  usePageLayoutScroll({
    onEndReached: onEndReached ? loadMore : undefined,
    onEndReachedThreshold,
  })

  const nativeOnEndReached = !isWeb && onEndReached ? loadMore : undefined

  const refreshControlElement = refreshControl ?? (refreshing !== undefined && onRefresh ? (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  ) : undefined)

  return (
    <FlatList<T>
      ref={ref}
      data={data}
      renderItem={renderItem}
      scrollEnabled={!isWeb}
      onEndReached={nativeOnEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshControl={refreshControlElement}
      contentInsetAdjustmentBehavior={ Platform.OS === 'ios' ? 'automatic' : undefined}
      contentContainerStyle={[
        {
          paddingTop: Platform.OS === 'ios' ? 8 : spacingValues.paddingTop,
          paddingBottom: spacingValues.paddingBottom,
        },
        contentContainerStyle,
      ]}
      {...rest}
    />
  )
}

const LayoutFlatListForwarded = React.forwardRef(LayoutFlatListInner)
LayoutFlatListForwarded.displayName = 'LayoutFlatList'

const LayoutFlatList = LayoutFlatListForwarded as <T>(
  props: LayoutFlatListProps<T> & { ref?: React.Ref<FlatList<T>> }
) => React.ReactElement

export default LayoutFlatList