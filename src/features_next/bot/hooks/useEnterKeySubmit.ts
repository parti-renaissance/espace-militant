import { useEffect, type RefObject } from 'react'
import { isWeb } from 'tamagui'

import { getDomFromTamaguiRef, type TamaguiInputRef } from '../utils/getDomFromTamaguiRef'

export function useEnterKeySubmit(inputRef: RefObject<TamaguiInputRef | null>, onSubmit: () => void) {
  useEffect(() => {
    if (!isWeb) return
    const dom = getDomFromTamaguiRef(inputRef)
    if (!dom) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSubmit()
      }
    }

    dom.addEventListener('keydown', handler)
    return () => dom.removeEventListener('keydown', handler)
  }, [inputRef, onSubmit])
}
