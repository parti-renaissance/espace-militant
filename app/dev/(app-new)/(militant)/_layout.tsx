import React from 'react'
import { Stack } from 'expo-router'
import Layout from '@/components/Navigation/Layout'

export default function AppNewLayout() {
  return (
    <Layout sidebarState='militant'>
      <Layout.ScrollView>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
      </Layout.ScrollView>
    </Layout>
  )
}

