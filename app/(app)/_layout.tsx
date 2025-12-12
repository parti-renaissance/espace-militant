import React, { useState, useMemo, useCallback } from 'react'
import { Stack } from 'expo-router'
import Layout from '@/components/AppStructure/Layout/Layout'
import { LayoutContext, useLayoutContext } from '@/components/AppStructure/Layout/LayoutContext'
import { SideBarState } from '@/components/AppStructure/Navigation/SideBar'
import ScopesSelector from '@/features/scopes-selector'

function AppNewLayoutContent() {
  const { sidebarState, hideTabBar, hideSideBar } = useLayoutContext()

  const effectiveSidebarState = useMemo(() =>
    hideSideBar ? 'hide' : sidebarState,
    [hideSideBar, sidebarState]
  )

  // Stack global pour gérer la navigation de détail (création, édition, détails, etc.)
  // Les pages de premier niveau sont gérées par (tabs)
  const screenOptions = useMemo(() => ({
    headerShown: false,
    animation: 'simple_push' as const,
    fullScreenGestureEnabled: true,
    contentStyle: {
      backgroundColor: '#fafafb',
    },

  }), [])

  const layoutContent = useMemo(() => (
    <Layout sidebarState={effectiveSidebarState} hideTabBar={hideTabBar}>
      <ScopesSelector />
      <Stack screenOptions={screenOptions} />
    </Layout>
  ), [effectiveSidebarState, hideTabBar, screenOptions])

  return layoutContent
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
