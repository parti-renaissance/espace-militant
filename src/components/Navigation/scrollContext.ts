import { createContext } from 'react'

export const ScrollContext = createContext<{
  layoutRef: React.RefObject<HTMLDivElement> | null
  scrollActive: boolean
}>({
  layoutRef: null,
  scrollActive: false,
})
