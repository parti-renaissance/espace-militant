import { useCallback } from 'react'
import { useFocusEffect } from 'expo-router'

import { useLayoutContext } from '@/components/AppStructure/Layout/LayoutContext'

export function useRegisterPageScrollToTop(scrollToTop: () => void) {
  const { setPageScrollToTop } = useLayoutContext()

  useFocusEffect(
    useCallback(() => {
      setPageScrollToTop(scrollToTop)
      return () => setPageScrollToTop(null)
    }, [scrollToTop, setPageScrollToTop]),
  )
}
