import { createContext, useContext, useEffect } from 'react'
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

export const useHideTabBar = () => {
  const { setHideTabBar } = useLayoutContext()
  
  useEffect(() => {
    setHideTabBar(true)
    return () => setHideTabBar(false)
  }, [setHideTabBar])
}

