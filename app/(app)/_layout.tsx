import React, { useState, useMemo, useCallback } from 'react'
import { Stack, Tabs } from 'expo-router'
import { isWeb } from 'tamagui'
import Layout from '@/components/AppStructure/Layout/Layout'
import { LayoutContext, useLayoutContext } from '@/components/AppStructure/Layout/LayoutContext'
import { SideBarState } from '@/components/AppStructure/Navigation/SideBar'
import { useMilitantNavItems, useCadreNavItems } from '@/config/navigationItems'

function AppNewLayoutContent() {
  const { sidebarState, hideTabBar, hideSideBar } = useLayoutContext()
  const militantNavItems = useMilitantNavItems()
  const cadreNavItems = useCadreNavItems()

  const effectiveSidebarState = useMemo(() =>
    hideSideBar ? 'hide' : sidebarState,
    [hideSideBar, sidebarState]
  )

  // Sur mobile : Tabs (pattern standard sans historique)
  // Sur web : Stack (avec historique de navigation)
  const Navigator = isWeb ? Stack : Tabs
  const screenOptions = useMemo(() => isWeb
    ? { headerShown: false, contentStyle: { backgroundColor: '#fafafb' } }
    : {
      headerShown: false,
      tabBarStyle: { display: 'none' as const }, // custom tabbar and sidebar
      // lazy: true,
      contentStyle: { backgroundColor: '#fafafb' },
    }, [])

  return (
    <Layout sidebarState={effectiveSidebarState} hideTabBar={hideTabBar}>
      <Navigator screenOptions={screenOptions}>
        {militantNavItems
          .filter(item => item.routeName)
          .map((item) => (
            <Navigator.Screen
              key={item.id}
              name={item.routeName!}
              options={{ title: item.text }}
            />
          ))}

        {cadreNavItems
          .filter(item => item.routeName)
          .map((item) => (
            <Navigator.Screen
              key={item.id}
              name={item.routeName!}
              options={{ title: item.text }}
            />
          ))}
      </Navigator>
    </Layout>
  )
}

export default function AppNewLayout() {
  const [sidebarState, setSidebarState] = useState<SideBarState>('militant')
  const [hideTabBar, setHideTabBar] = useState(false)
  const [hideSideBar, setHideSideBar] = useState(false)

  const setSidebarStateOptimized = useCallback((newState: SideBarState) => {
    setSidebarState(prev => prev === newState ? prev : newState)
  }, [])

  const setHideTabBarOptimized = useCallback((newValue: boolean) => {
    setHideTabBar(prev => prev === newValue ? prev : newValue)
  }, [])

  const setHideSideBarOptimized = useCallback((newValue: boolean) => {
    setHideSideBar(prev => prev === newValue ? prev : newValue)
  }, [])

  const contextValue = useMemo(() => ({
    sidebarState,
    setSidebarState: setSidebarStateOptimized,
    hideTabBar,
    setHideTabBar: setHideTabBarOptimized,
    hideSideBar,
    setHideSideBar: setHideSideBarOptimized,
  }), [sidebarState, hideTabBar, hideSideBar, setSidebarStateOptimized, setHideTabBarOptimized, setHideSideBarOptimized])

  return (
    <LayoutContext.Provider value={contextValue}>
      <AppNewLayoutContent />
    </LayoutContext.Provider>
  )
}
