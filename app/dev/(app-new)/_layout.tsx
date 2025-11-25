import React, { useState } from 'react'
import { Tabs } from 'expo-router'
import Layout from '@/components/Navigation/Layout'
import { LayoutContext } from '@/components/Navigation/LayoutContext'
import { SideBarState } from '@/components/Navigation/SideBar'
import { militantNavItems, cadreNavItems } from '@/config/navigationItems'

export default function AppNewLayout() {
  const [sidebarState, setSidebarState] = useState<SideBarState>('militant')
  const [hideTabBar, setHideTabBar] = useState(false)

  return (
    <LayoutContext.Provider value={{ sidebarState, setSidebarState, hideTabBar, setHideTabBar }}>
      <Layout sidebarState={sidebarState} hideTabBar={hideTabBar}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' }, // custom tabbar and sidebar
            lazy: true, // load pages only when they are opened
          }}
        >
          {militantNavItems
            .filter(item => item.routeName)
            .map((item) => (
              <Tabs.Screen
                key={item.id}
                name={item.routeName!}
                options={{ title: item.text }}
                listeners={{
                  focus: () => setSidebarState('militant'),
                }}
              />
            ))}

          {cadreNavItems
            .filter(item => item.routeName)
            .map((item) => (
              <Tabs.Screen
                key={item.id}
                name={item.routeName!}
                options={{ title: item.text }}
                listeners={{
                  focus: () => setSidebarState('cadre'),
                }}
              />
            ))}
        </Tabs>
      </Layout>
    </LayoutContext.Provider>
  )
}
