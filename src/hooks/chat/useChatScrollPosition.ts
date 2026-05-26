import { useCallback, useState } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

const BOTTOM_THRESHOLD_PX = 80

export function useChatScrollPosition() {
  const [isAtBottom, setIsAtBottom] = useState(true)

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
    setIsAtBottom(contentSize.height - contentOffset.y - layoutMeasurement.height < BOTTOM_THRESHOLD_PX)
  }, [])

  return { isAtBottom, handleScroll }
}
