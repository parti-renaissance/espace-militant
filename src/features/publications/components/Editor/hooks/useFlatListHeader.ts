import React from 'react'
import { LayoutChangeEvent } from 'react-native'
import { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

const useFlatListHeader = () => {
  const scrollY = useSharedValue(0)
  const [headerHeight, setHeaderHeight] = React.useState(0)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(scrollY.value, [0, headerHeight], [0, -headerHeight], Extrapolation.CLAMP),
        },
      ],
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      zIndex: 1,
    }
  }, [headerHeight])

  const handleHeaderLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setHeaderHeight(height)
  }

  return { headerStyle, scrollHandler, handleHeaderLayout, headerHeight }
}

export default useFlatListHeader
