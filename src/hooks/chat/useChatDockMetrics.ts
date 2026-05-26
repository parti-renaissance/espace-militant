import { useCallback, useState } from 'react'
import { type LayoutChangeEvent, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { isWeb } from 'tamagui'

import useKeyboardHeight from '@/hooks/useKeyboardHeight'

export type ChatDockMetrics = {
  keyboardHeight: number
  keyboardOpen: boolean
  dockBottomOffset: number
  scrollButtonBottom: number
  contentPaddingBottom: number
  onDockLayout: (e: LayoutChangeEvent) => void
}

export function useChatDockMetrics(): ChatDockMetrics {
  const insets = useSafeAreaInsets()
  const keyboardHeight = useKeyboardHeight()
  const [dockHeight, setDockHeight] = useState(0)

  const keyboardOpen = !isWeb && keyboardHeight > 0
  const dockBottomOffset = isWeb ? 0 : keyboardOpen ? keyboardHeight + 8 : Platform.OS === 'ios' ? insets.bottom : 16
  const scrollButtonBottom = dockBottomOffset + dockHeight + 8
  const contentPaddingBottom = dockBottomOffset + dockHeight + 16

  const onDockLayout = useCallback((e: LayoutChangeEvent) => {
    setDockHeight(e.nativeEvent.layout.height)
  }, [])

  return { keyboardHeight, keyboardOpen, dockBottomOffset, scrollButtonBottom, contentPaddingBottom, onDockLayout }
}
