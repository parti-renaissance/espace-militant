import type { ComponentRef, RefObject } from 'react'
import type { Input } from 'tamagui'

export type TamaguiInputRef = ComponentRef<typeof Input> & {
  getNativeRef?: () => ComponentRef<typeof Input> | null
}

export function getDomFromTamaguiRef(ref: RefObject<TamaguiInputRef | null>): HTMLElement | null {
  const element = ref.current
  if (!element) return null
  const textarea = element.getNativeRef?.() ?? element
  const nativeNode = (textarea as { _nativeNode?: HTMLElement })?._nativeNode
  const domElement = nativeNode ?? (textarea as unknown as HTMLElement | null)
  return domElement instanceof HTMLElement ? domElement : null
}
