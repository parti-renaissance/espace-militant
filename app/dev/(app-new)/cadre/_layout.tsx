import React, { useLayoutEffect } from 'react'
import { Slot } from 'expo-router'
import { useLayoutContext } from '@/components/Navigation/LayoutContext'

export default function AppNewLayout() {
  const { sidebarState, setSidebarState } = useLayoutContext()

  useLayoutEffect(() => {
    if (sidebarState !== 'cadre') {
      setSidebarState('cadre')
    }
  }, [sidebarState, setSidebarState])

  return <Slot />
}
