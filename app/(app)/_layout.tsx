import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Stack } from 'expo-router'

import Layout from '@/components/AppStructure/Layout/Layout'
import { LayoutContext, useLayoutContext } from '@/components/AppStructure/Layout/LayoutContext'
import { SideBarState } from '@/components/AppStructure/Navigation/SideBar'
import { CompleteProfilProvider } from '@/features_next/profil/context/CompleteProfilContext'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

function AppNewLayoutContent() {
  const { sidebarState, hideTabBar, hideSideBar } = useLayoutContext()

  const effectiveSidebarState = useMemo(() => (hideSideBar ? 'hide' : sidebarState), [hideSideBar, sidebarState])

  // Stack global pour gérer la navigation de détail (création, édition, détails, etc.)
  // Les pages de premier niveau sont gérées par (tabs)
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      animation: 'simple_push' as const,
      fullScreenGestureEnabled: true,
      contentStyle: {
        backgroundColor: '#fafafb',
      },
    }),
    [],
  )

  const layoutContent = useMemo(
    () => (
      <Layout sidebarState={effectiveSidebarState} hideTabBar={hideTabBar}>
        <Stack screenOptions={screenOptions} initialRouteName="(tabs)">
          <Stack.Screen name="(tabs)" />
        </Stack>
      </Layout>
    ),
    [effectiveSidebarState, hideTabBar, screenOptions],
  )

  return layoutContent
}

export default function AppNewLayout() {
  const [sidebarState, setSidebarState] = useState<SideBarState>('militant')
  const [hideTabBar, setHideTabBar] = useState(false)
  const [hideSideBar, setHideSideBar] = useState(false)
  const [floatingContent, setFloatingContent] = useState<React.ReactNode | null>(null)
  const pageScrollToTopRef = useRef<(() => void) | null>(null)

  const setSidebarStateOptimized = useCallback((newState: SideBarState) => {
    setSidebarState((prev) => (prev === newState ? prev : newState))
  }, [])

  const setHideTabBarOptimized = useCallback((newValue: boolean) => {
    setHideTabBar((prev) => (prev === newValue ? prev : newValue))
  }, [])

  const setHideSideBarOptimized = useCallback((newValue: boolean) => {
    setHideSideBar((prev) => (prev === newValue ? prev : newValue))
  }, [])

  const setFloatingContentOptimized = useCallback((newValue: React.ReactNode | null) => {
    setFloatingContent((prev) => (prev === newValue ? prev : newValue))
  }, [])

  const setPageScrollToTop = useCallback((handler: (() => void) | null) => {
    pageScrollToTopRef.current = handler
  }, [])

  const pageScrollToTop = useCallback(() => {
    pageScrollToTopRef.current?.()
  }, [])

  const contextValue = useMemo(
    () => ({
      sidebarState,
      setSidebarState: setSidebarStateOptimized,
      hideTabBar,
      setHideTabBar: setHideTabBarOptimized,
      hideSideBar,
      setHideSideBar: setHideSideBarOptimized,
      floatingContent,
      setFloatingContent: setFloatingContentOptimized,
      pageScrollToTop,
      setPageScrollToTop,
    }),
    [
      sidebarState,
      hideTabBar,
      hideSideBar,
      floatingContent,
      pageScrollToTop,
      setPageScrollToTop,
      setSidebarStateOptimized,
      setHideTabBarOptimized,
      setHideSideBarOptimized,
      setFloatingContentOptimized,
    ],
  )

  return (
    <LayoutContext.Provider value={contextValue}>
      <CompleteProfilProvider>
        <AppNewLayoutContent />
      </CompleteProfilProvider>
    </LayoutContext.Provider>
  )
}
