import { useCallback, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
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

const INITIAL_DOCK_HEIGHT_WEB = 180

export function useChatDockMetrics(): ChatDockMetrics {
  const keyboardHeight = useKeyboardHeight()
  const [dockHeight, setDockHeight] = useState(isWeb ? INITIAL_DOCK_HEIGHT_WEB : 0)

  const keyboardOpen = !isWeb && keyboardHeight > 0
  const dockBottomOffset = isWeb ? 0 : keyboardOpen ? keyboardHeight + 8 : 0
  const scrollButtonBottom = dockBottomOffset + dockHeight + 8
  const contentPaddingBottom = dockBottomOffset + dockHeight + 16

  const onDockLayout = useCallback((e: LayoutChangeEvent) => {
    setDockHeight(e.nativeEvent.layout.height)
  }, [])

  return { keyboardHeight, keyboardOpen, dockBottomOffset, scrollButtonBottom, contentPaddingBottom, onDockLayout }
}
