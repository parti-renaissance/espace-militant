import React, { useEffect } from 'react'
import { Stack, usePathname } from 'expo-router'
import { useLayoutContext } from '@/components/Navigation/LayoutContext'

export default function ProfilLayout() {
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

