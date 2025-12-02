import React, { useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform, RefreshControl, ScrollView, ScrollViewProps } from 'react-native'
import { isWeb } from 'tamagui'
import { usePageLayoutScroll } from '@/components/Navigation/usePageLayoutScroll'
import useLayoutSpacing, { type UseLayoutSpacingOptions } from '@/components/Navigation/hook/useLayoutSpacing'

type LayoutScrollViewProps = Omit<ScrollViewProps, 'onEndReached'> & {
  onEndReached?: () => void
  onEndReachedThreshold?: number
  hasMore?: boolean
  padding?: UseLayoutSpacingOptions
  children: React.ReactNode
  refreshControl?: React.ReactElement
  refreshing?: boolean
  onRefresh?: () => void
}

export default function LayoutScrollView({
  onEndReached,
  onEndReachedThreshold = 0.4,
  hasMore = false,
  padding = true,
  children,
  refreshControl,
  refreshing,
  onRefresh,
  ...rest
}: LayoutScrollViewProps) {
  const spacingValues = useLayoutSpacing(padding)

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

  const refreshControlElement = refreshControl ?? (refreshing !== undefined && onRefresh ? (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  ) : undefined)
  
  return (
    <ScrollView
      scrollEnabled={!isWeb}
      onScroll={handleNativeScroll}
      scrollEventThrottle={16}
      refreshControl={refreshControlElement}
      contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'automatic' : undefined}
      contentContainerStyle={[
        {
          paddingTop: Platform.OS === 'ios' ? 0 : spacingValues.paddingTop, 
          paddingBottom: spacingValues.paddingBottom,
        },
        rest.contentContainerStyle,
      ]}
      {...rest}
    >
      {children}
    </ScrollView>
  )
}