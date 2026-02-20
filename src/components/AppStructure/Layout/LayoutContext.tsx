import { createContext, useContext, type ReactNode } from 'react'

import { SideBarState } from '@/components/AppStructure/Navigation/SideBar'

// Layout Context - gestion de l'état du layout (sidebar, tabbar, floating zone)
interface LayoutContextType {
  sidebarState: SideBarState
  setSidebarState: (state: SideBarState) => void
  hideTabBar: boolean
  setHideTabBar: (hide: boolean) => void
  hideSideBar: boolean
  setHideSideBar: (hide: boolean) => void
  floatingContent: ReactNode | null
  setFloatingContent: (content: ReactNode | null) => void
}

export const LayoutContext = createContext<LayoutContextType>({
  sidebarState: 'militant',
  setSidebarState: () => {},
  hideTabBar: false,
  setHideTabBar: () => {},
  hideSideBar: false,
  setHideSideBar: () => {},
  floatingContent: null,
  setFloatingContent: () => {},
})

export const useLayoutContext = () => useContext(LayoutContext)

export const ScrollContext = createContext<{
  layoutRef: React.RefObject<HTMLDivElement> | null
  scrollActive: boolean
}>({
  layoutRef: null,
  scrollActive: false,
})
