import React, { useState } from 'react'
import { Stack, Tabs } from 'expo-router'
import { Platform } from 'react-native'
import Layout from '@/components/Navigation/Layout'
import { LayoutContext } from '@/components/Navigation/LayoutContext'
import { SideBarState } from '@/components/Navigation/SideBar'
import { militantNavItems, cadreNavItems } from '@/config/navigationItems'
import { isWeb } from 'tamagui'

export default function AppNewLayout() {
  const [sidebarState, setSidebarState] = useState<SideBarState>('militant')
  const [hideTabBar, setHideTabBar] = useState(false)

  // Sur mobile : Tabs (pattern standard sans historique)
  // Sur web : Stack (avec historique de navigation)
  const Navigator = isWeb ? Stack : Tabs
  const screenOptions = isWeb
    ? {  headerShown: false }
    : {
        headerShown: false,
        tabBarStyle: { display: 'none' as const }, // custom tabbar and sidebar
        lazy: true, // load pages only when they are opened
      }

  return (
    <LayoutContext.Provider value={{ sidebarState, setSidebarState, hideTabBar, setHideTabBar }}>
      <Layout sidebarState={sidebarState} hideTabBar={hideTabBar}>
        <Navigator screenOptions={screenOptions}>
          {militantNavItems
            .filter(item => item.routeName)
            .map((item) => (
              <Navigator.Screen
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
              <Navigator.Screen
                key={item.id}
                name={item.routeName!}
                options={{ title: item.text }}
                listeners={{
                  focus: () => setSidebarState('cadre'),
                }}
              />
            ))}
        </Navigator>
      </Layout>
    </LayoutContext.Provider>
  )
}
