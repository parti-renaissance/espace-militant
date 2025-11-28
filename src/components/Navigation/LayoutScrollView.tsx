import React, { useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, ScrollViewProps } from 'react-native'
import { isWeb } from 'tamagui'
import { usePageLayoutScroll } from '@/components/Navigation/usePageLayoutScroll'
import useLayoutPadding, { type UseLayoutPaddingOptions } from '@/components/Navigation/hook/useLayoutPadding'

type LayoutScrollViewProps = Omit<ScrollViewProps, 'onEndReached'> & {
  onEndReached?: () => void
  onEndReachedThreshold?: number
  hasMore?: boolean
  padding?: UseLayoutPaddingOptions
  children: React.ReactNode
}

export default function LayoutScrollView({
  onEndReached,
  onEndReachedThreshold = 0.4,
  hasMore = false,
  padding = true,
  children,
  ...rest
}: LayoutScrollViewProps) {
  const paddingValues = useLayoutPadding(padding)

  const loadMore = useCallback(() => {
    if (onEndReached && hasMore) {
      onEndReached()
    }
  }, [hasMore, onEndReached])

  // Web: écouteur sur le conteneur parent via le hook
  usePageLayoutScroll({
    onEndReached: onEndReached ? loadMore : undefined,
    onEndReachedThreshold,
  })

  // Natif: écouteur sur la ScrollView elle-même
  const handleNativeScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!onEndReached || isWeb || !hasMore) return

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
    const thresholdPixels = contentSize.height * (onEndReachedThreshold ?? 0.4)

    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - thresholdPixels) {
      loadMore()
    }
  }, [onEndReached, hasMore, loadMore, onEndReachedThreshold])

  return (
    <ScrollView
      scrollEnabled={!isWeb}
      onScroll={handleNativeScroll}
      scrollEventThrottle={16}
      contentContainerStyle={{
        paddingTop: paddingValues.paddingTop,
        paddingBottom: paddingValues.paddingBottom,
        paddingLeft: paddingValues.paddingLeft,
        paddingRight: paddingValues.paddingRight,
      }}
      {...rest}
    >
      {children}
    </ScrollView>
  )
}