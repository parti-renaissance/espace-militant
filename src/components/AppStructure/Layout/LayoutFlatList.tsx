import React, { useCallback, useRef } from 'react'
import { FlatList, Platform, RefreshControl, type FlatListProps } from 'react-native'
import { isWeb, YStack } from 'tamagui'

import useLayoutSpacing, { type UseLayoutSpacingOptions } from '@/components/AppStructure/hooks/useLayoutSpacing'
import { usePageLayoutScroll } from '@/components/AppStructure/hooks/usePageLayoutScroll'
import { useRegisterPageScrollToTop } from '@/components/AppStructure/hooks/useRegisterPageScrollToTop'

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

const noop = () => undefined

function renderListComponent(
  component: FlatListProps<unknown>['ListHeaderComponent'] | FlatListProps<unknown>['ListFooterComponent'] | FlatListProps<unknown>['ListEmptyComponent'],
): React.ReactNode {
  if (!component) return null
  if (React.isValidElement(component)) return component
  if (typeof component === 'function') return React.createElement(component)
  return null
}

function LayoutFlatListInner<T>(props: LayoutFlatListProps<T>, ref: React.Ref<FlatList<T>>) {
  const {
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
    ListHeaderComponent,
    ListFooterComponent,
    ListEmptyComponent,
    keyExtractor,
    ...rest
  } = props

  const spacingValues = useLayoutSpacing(padding)
  const flatListRef = useRef<FlatList<T>>(null)

  const loadMore = useCallback(() => {
    if (onEndReached && hasMore) {
      onEndReached()
    }
  }, [hasMore, onEndReached])

  const { layoutRef } = usePageLayoutScroll({
    onEndReached: isWeb && onEndReached ? loadMore : undefined,
    onEndReachedThreshold,
  })

  const setFlatListRef = useCallback(
    (node: FlatList<T> | null) => {
      flatListRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref],
  )

  const scrollToTop = useCallback(() => {
    if (isWeb && layoutRef?.current) {
      layoutRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
    }
  }, [layoutRef])

  useRegisterPageScrollToTop(scrollToTop)

  const baseContainerStyle = [
    { paddingTop: Platform.OS === 'ios' ? 8 : spacingValues.paddingTop, paddingBottom: spacingValues.paddingBottom },
    contentContainerStyle,
  ]

  if (isWeb && Array.isArray(data)) {
    const headerNode = renderListComponent(ListHeaderComponent)
    const footerNode = renderListComponent(ListFooterComponent)

    if (data.length === 0) {
      const emptyNode = renderListComponent(ListEmptyComponent)
      return (
        <YStack style={baseContainerStyle}>
          {headerNode}
          {emptyNode}
          {footerNode}
        </YStack>
      )
    }

    return (
      <YStack style={baseContainerStyle}>
        {headerNode}
        {renderItem &&
          data.map((item, index) => {
            const key = keyExtractor ? keyExtractor(item, index) : String(index)
            return (
              <React.Fragment key={key}>
                {renderItem({
                  item,
                  index,
                  separators: {
                    highlight: noop,
                    unhighlight: noop,
                    updateProps: noop,
                  },
                })}
              </React.Fragment>
            )
          })}
        {footerNode}
      </YStack>
    )
  }

  const refreshControlElement =
    refreshControl ??
    (refreshing !== undefined && onRefresh ? (
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={Platform.OS === 'android' && padding !== false ? 8 : undefined} />
    ) : undefined)

  return (
    <FlatList<T>
      ref={setFlatListRef}
      data={data}
      renderItem={renderItem}
      scrollEnabled={!isWeb}
      onEndReached={!isWeb && onEndReached ? loadMore : undefined}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshControl={refreshControlElement}
      contentInsetAdjustmentBehavior={Platform.OS === 'ios' && padding !== false ? 'automatic' : undefined}
      contentContainerStyle={baseContainerStyle}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      keyExtractor={keyExtractor}
      {...rest}
    />
  )
}

const LayoutFlatListForwarded = React.forwardRef(LayoutFlatListInner)
LayoutFlatListForwarded.displayName = 'LayoutFlatList'

const LayoutFlatList = LayoutFlatListForwarded as <T>(props: LayoutFlatListProps<T> & { ref?: React.Ref<FlatList<T>> }) => React.ReactElement

export default LayoutFlatList
