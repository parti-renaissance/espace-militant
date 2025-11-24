import React, { useState } from 'react'
import { Slot } from 'expo-router'
import Layout from '@/components/Navigation/Layout'
import { LayoutContext } from '@/components/Navigation/LayoutContext'
import { SideBarState } from '@/components/Navigation/SideBar'

export default function AppNewLayout() {
  const [sidebarState, setSidebarState] = useState<SideBarState>('militant')
  const [hideTabBar, setHideTabBar] = useState(false)

  return (
    <LayoutContext.Provider value={{ sidebarState, setSidebarState, hideTabBar, setHideTabBar }}>
      <Layout sidebarState={sidebarState} hideTabBar={hideTabBar}>
        <Slot />
      </Layout>
    </LayoutContext.Provider>
  )
}
