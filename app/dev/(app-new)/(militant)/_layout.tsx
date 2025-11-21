import React from 'react'
import { Slot } from 'expo-router'
import Layout from '@/components/Navigation/Layout'

export default function AppNewLayout() {
  return (
    <Layout sidebarState='militant'>
        <Slot /> 
    </Layout>
  )
}

