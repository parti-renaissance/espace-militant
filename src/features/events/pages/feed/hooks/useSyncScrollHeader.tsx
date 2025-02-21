import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

export const useSyncScrollHeader = () => {
  const scrollY = useSharedValue(0)
  const RA_headerHeight = useSharedValue(145)
  const lastScrollValue = useSharedValue(0)
  const isScrollingDown = useSharedValue(false)
  const headerOffset = useSharedValue(0)

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const scrollDiff = scrollY.value - lastScrollValue.value

    // More responsive scroll direction detection
    if (Math.abs(scrollDiff) > 1.5) {
      const isScrollingDownNew = scrollDiff > 0

      // Only update if direction actually changed
      if (isScrollingDown.value !== isScrollingDownNew) {
        isScrollingDown.value = isScrollingDownNew

        // Reset header position when changing to scroll up
        if (!isScrollingDownNew && scrollY.value > RA_headerHeight.value) {
          headerOffset.value = -RA_headerHeight.value
        }
      }
    }
    lastScrollValue.value = scrollY.value

    // Calculate target position with momentum consideration
    const targetPosition = isScrollingDown.value ? Math.min(-Math.max(scrollY.value - RA_headerHeight.value, 0), 0) : 0

    // Smooth transition for header
    headerOffset.value = withSpring(targetPosition, {
      damping: 15,
      stiffness: 150,
      mass: 0.5,
      velocity: scrollDiff, // Add velocity for more natural feel
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    })

    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      transform: [
        {
          translateY: headerOffset.value,
        },
      ],
    }
  })

  const handleListScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = e.nativeEvent.contentOffset.y
  }

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Snap header to closest position when scroll momentum ends
    if (headerOffset.value < -RA_headerHeight.value / 2) {
      headerOffset.value = withSpring(-RA_headerHeight.value, {
        damping: 15,
        stiffness: 150,
      })
    } else {
      headerOffset.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      })
    }
  }

  return { handleListScroll, handleMomentumScrollEnd, headerAnimatedStyle }
}
