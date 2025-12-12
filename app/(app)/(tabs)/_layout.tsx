import React, { useMemo } from 'react'
import { Slot, Tabs } from 'expo-router'
import { isWeb } from 'tamagui'

export default function TabsLayout() {
  if (isWeb) {
    return <Slot />
  }

  const screenOptions = useMemo(() => ({
    headerShown: false,
    tabBarStyle: { display: 'none' as const }, // custom tabbar and sidebar
    contentStyle: { backgroundColor: '#fafafb' },
  }), [])

  return (
    <Tabs screenOptions={screenOptions} />
  )
}

