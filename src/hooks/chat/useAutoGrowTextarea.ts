import { useEffect, type RefObject } from 'react'
import { isWeb } from 'tamagui'

import { getDomFromTamaguiRef, type TamaguiInputRef } from './utils/getDomFromTamaguiRef'

export const INPUT_MAX_HEIGHT = 180

export function useAutoGrowTextarea(inputRef: RefObject<TamaguiInputRef | null>, value: string) {
  useEffect(() => {
    if (!isWeb) return
    const dom = getDomFromTamaguiRef(inputRef)
    if (!dom || !(dom instanceof HTMLTextAreaElement)) return
    dom.style.height = 'auto'
    const next = Math.min(dom.scrollHeight, INPUT_MAX_HEIGHT)
    dom.style.height = `${next}px`
    dom.style.overflowY = dom.scrollHeight > INPUT_MAX_HEIGHT ? 'auto' : 'hidden'
  }, [inputRef, value])
}
