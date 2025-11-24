import { createContext, useContext } from 'react'
import { SideBarState } from './SideBar'

interface LayoutContextType {
  sidebarState: SideBarState
  setSidebarState: (state: SideBarState) => void
  hideTabBar: boolean
  setHideTabBar: (hide: boolean) => void
}

export const LayoutContext = createContext<LayoutContextType>({
  sidebarState: 'militant',
  setSidebarState: () => {},
  hideTabBar: false,
  setHideTabBar: () => {},
})

export const useLayoutContext = () => useContext(LayoutContext)

