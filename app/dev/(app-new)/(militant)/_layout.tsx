import React, { useLayoutEffect } from 'react'
import { Slot } from 'expo-router'
import { useLayoutContext } from '@/components/Navigation/LayoutContext'

export default function AppNewLayout() {
  const { sidebarState, setSidebarState } = useLayoutContext()

  useLayoutEffect(() => {
      setSidebarState('militant')
  }, [sidebarState, setSidebarState])

  return <Slot />
}
