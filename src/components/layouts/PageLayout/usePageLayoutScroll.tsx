import { ComponentRef, MutableRefObject, RefObject, useContext, useEffect } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'
import { isWeb } from 'tamagui'
import { ScrollContext } from './scrollContext'

type Props = {
  onEndReached?: () => void
  onEndReachedThreshold?: number
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
  onMomentumScrollEnd?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
  scrollEventThrottle?: number
  ref?: MutableRefObject<ComponentRef<typeof ScrollView> | null> | RefObject<HTMLDivElement>
}

export const usePageLayoutScroll = (props?: Props) => {
  const { scrollActive, layoutRef } = useContext(ScrollContext)

  useEffect(() => {
    if (!isWeb) return
    if (!scrollActive) return
    if (layoutRef === null) return
    if (layoutRef.current === null) return
    if (props?.ref) {
      props.ref = layoutRef
    }
    const scrollView = layoutRef.current

    const handleScrollReachedEnd = () => {
      if (!scrollActive || !props?.onEndReached) return
      const { scrollTop, scrollHeight, clientHeight } = scrollView
      const threshold = props.onEndReachedThreshold ?? 0.5
      const thresholdPixels = scrollHeight * threshold
      if (scrollTop + clientHeight >= thresholdPixels) {
        props.onEndReached()
      }
    }

    let timeoutId: ReturnType<typeof setTimeout>
    const handleScroll = () => {
      if (!scrollActive || !props?.onScroll) return
      console.log(scrollView.scrollTop)
      const nativeEvent = {
        nativeEvent: {
          contentOffset: { y: scrollView.scrollTop },
          contentSize: { height: scrollView.scrollHeight, width: scrollView.scrollWidth },
          layoutMeasurement: { height: scrollView.clientHeight, width: scrollView.clientWidth },
        },
      } as NativeSyntheticEvent<NativeScrollEvent>

      if (props?.scrollEventThrottle) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          props.onScroll?.(nativeEvent)
        }, props.scrollEventThrottle)
      } else {
        props.onScroll?.(nativeEvent)
      }
    }

    let isScrolling: ReturnType<typeof setTimeout>

    const handleMomentumScrollEnd = () => {
      if (!scrollActive || !props?.onMomentumScrollEnd) return

      clearTimeout(isScrolling)
      isScrolling = setTimeout(() => {
        const nativeEvent = {
          nativeEvent: {
            contentOffset: { y: scrollView.scrollTop },
            contentSize: { height: scrollView.scrollHeight, width: scrollView.scrollWidth },
            layoutMeasurement: { height: scrollView.clientHeight, width: scrollView.clientWidth },
          },
        } as NativeSyntheticEvent<NativeScrollEvent>
        props.onMomentumScrollEnd?.(nativeEvent)
      }, 150)
    }

    scrollView.addEventListener('scroll', handleScroll)
    scrollView.addEventListener('scroll', handleScrollReachedEnd)
    scrollView.addEventListener('scroll', handleMomentumScrollEnd)

    return () => {
      scrollView.removeEventListener('scroll', handleScroll)
      scrollView.removeEventListener('scroll', handleScrollReachedEnd)
      scrollView.removeEventListener('scroll', handleMomentumScrollEnd)
      clearTimeout(timeoutId)
    }
  }, [scrollActive])

  return { isWebPageLayoutScrollActive: scrollActive, layoutRef }
}
