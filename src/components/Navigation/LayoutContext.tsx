import { createContext, useContext } from 'react'
import { SideBarState } from './SideBar'

interface LayoutContextType {
  sidebarState: SideBarState
  setSidebarState: (state: SideBarState) => void
  hideTabBar: boolean
  setHideTabBar: (hide: boolean) => void
  hideSideBar: boolean
  setHideSideBar: (hide: boolean) => void
}

export const LayoutContext = createContext<LayoutContextType>({
  sidebarState: 'militant',
  setSidebarState: () => {},
  hideTabBar: false,
  setHideTabBar: () => {},
  hideSideBar: false,
  setHideSideBar: () => {},
})

export const useLayoutContext = () => useContext(LayoutContext)

