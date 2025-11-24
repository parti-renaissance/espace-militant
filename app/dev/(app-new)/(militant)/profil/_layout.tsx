import React, { useEffect } from 'react'
import { Stack, usePathname } from 'expo-router'
import { useLayoutContext } from '@/components/Navigation/LayoutContext'

export default function ProfilLayout() {
  const pathname = usePathname()
  const { setHideTabBar } = useLayoutContext()

  useEffect(() => {
    const isProfileRoot = pathname === '/dev/profil' || pathname === '/dev/profil/'
    setHideTabBar(!isProfileRoot)

    return () => setHideTabBar(false)
  }, [pathname, setHideTabBar])

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'simple_push',
        fullScreenGestureEnabled: true,
        contentStyle: {
          backgroundColor: '#fafafb',
        },
      }}
    />
  )
}

