import React, { useCallback } from 'react'
import { FlatList, FlatListProps } from 'react-native'
import { isWeb } from 'tamagui'
import { usePageLayoutScroll } from '@/components/Navigation/usePageLayoutScroll'
import useLayoutPadding, { type UseLayoutPaddingOptions } from '@/components/Navigation/hook/useLayoutPadding'

type LayoutFlatListProps<T> = Omit<FlatListProps<T>, 'onEndReached' | 'data' | 'renderItem'> & {
  data: FlatListProps<T>['data']
  renderItem: FlatListProps<T>['renderItem']
  onEndReached?: () => void
  onEndReachedThreshold?: number
  hasMore?: boolean
  padding?: UseLayoutPaddingOptions
}

export default function LayoutFlatList<T>({
  onEndReached,
  onEndReachedThreshold = 0.4,
  hasMore = false,
  padding = true,
  data,
  renderItem,
  ...rest
}: LayoutFlatListProps<T>) {
  const paddingValues = useLayoutPadding(padding)

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

  return (
    <FlatList<T>
      data={data}
      renderItem={renderItem}
      scrollEnabled={!isWeb}
      onEndReached={nativeOnEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      contentContainerStyle={{
        paddingTop: paddingValues.paddingTop,
        paddingBottom: paddingValues.paddingBottom,
        paddingLeft: paddingValues.paddingLeft,
        paddingRight: paddingValues.paddingRight,
      }}
      {...rest}
    />
  )
}