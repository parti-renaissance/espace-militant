import React from 'react'
import { Slot, Stack } from 'expo-router'
import Layout from '@/components/Navigation/Layout'

export default function AppNewLayout() {
  return (
    <Layout sidebarState='cadre'>
      <Slot />
    </Layout>
  )
}

