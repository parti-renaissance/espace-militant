import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform, RefreshControl, ScrollView, ScrollViewProps } from 'react-native'
import { isWeb } from 'tamagui'
import { usePageLayoutScroll } from '@/components/AppStructure/hooks/usePageLayoutScroll'
import useLayoutSpacing, { type UseLayoutSpacingOptions } from '@/components/AppStructure/hooks/useLayoutSpacing'

type LayoutScrollViewProps = Omit<ScrollViewProps, 'onEndReached'> & {
  onEndReached?: () => void
  onEndReachedThreshold?: number
  hasMore?: boolean
  padding?: UseLayoutSpacingOptions
  disablePadding?: boolean
  children: React.ReactNode
  refreshControl?: React.ReactElement
  refreshing?: boolean
  onRefresh?: () => void
}

export type LayoutScrollViewRef = {
  scrollTo: (options: { x?: number; y?: number; animated?: boolean }) => void
}

const LayoutScrollView = forwardRef<LayoutScrollViewRef, LayoutScrollViewProps>(({
  onEndReached,
  onEndReachedThreshold = 0.4,
  hasMore = false,
  padding = true,
  disablePadding = false,
  children,
  refreshControl,
  refreshing,
  onRefresh,
  contentContainerStyle,
  onScroll,
  ...rest
}, ref) => {
  const spacingValues = useLayoutSpacing(padding)
  const scrollViewRef = useRef<ScrollView>(null)

  const loadMore = useCallback(() => {
    if (onEndReached && hasMore) {
      onEndReached()
    }
  }, [hasMore, onEndReached])

  // Web: écouteur sur le conteneur parent via le hook
  const { layoutRef } = usePageLayoutScroll({
    onEndReached: onEndReached ? loadMore : undefined,
    onEndReachedThreshold,
    onScroll,
    scrollEventThrottle: rest.scrollEventThrottle,
  })

  // Expose scrollTo method via ref
  useImperativeHandle(ref, () => ({
    scrollTo: (options: { x?: number; y?: number; animated?: boolean }) => {
      if (isWeb && layoutRef?.current) {
        // En web, on scroll sur le conteneur parent
        layoutRef.current.scrollTo({
          top: options.y ?? 0,
          left: options.x ?? 0,
          behavior: options.animated !== false ? 'smooth' : 'auto',
        })
      } else if (scrollViewRef.current) {
        // En natif, on utilise la méthode native
        scrollViewRef.current.scrollTo(options)
      }
    },
  }), [layoutRef])

  // Natif: écouteur sur la ScrollView elle-même
  const handleNativeScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log('handleNativeScroll', event.nativeEvent.contentOffset.y)
    onScroll?.(event)
    
    if (!onEndReached || isWeb || !hasMore) return

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
    const thresholdPixels = contentSize.height * (onEndReachedThreshold ?? 0.4)

    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - thresholdPixels) {
      loadMore()
    }
  }, [onEndReached, hasMore, loadMore, onEndReachedThreshold, onScroll])

  const refreshControlElement = refreshControl ?? (refreshing !== undefined && onRefresh ? (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  ) : undefined)
  
  return (
    <ScrollView
      ref={scrollViewRef}
      scrollEnabled={!isWeb}
      onScroll={handleNativeScroll}
      scrollEventThrottle={16}
      refreshControl={refreshControlElement}
      contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'automatic' : undefined}
      contentContainerStyle={[
        !disablePadding && {
          paddingTop: Platform.OS === 'ios' ? 0 : spacingValues.paddingTop, 
          paddingBottom: spacingValues.paddingBottom,
        },
        contentContainerStyle,
      ]}
      {...rest}
    >
      {children}
    </ScrollView>
  )
})

LayoutScrollView.displayName = 'LayoutScrollView'

export default LayoutScrollView