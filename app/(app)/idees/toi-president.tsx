import React from 'react'
import { Stack as RouterStack } from 'expo-router'
import Head from 'expo-router/head'
import { Dices } from '@tamagui/lucide-icons'

import Header from '@/components/AppStructure/Header'
import Layout from '@/components/AppStructure/Layout/Layout'
import { RequireAuth } from '@/components/RequireAuth'
import ToiPresidentGameScreen from '@/features/ideas/pages/toi-president'

import * as metatags from '@/config/metatags'

export default function ToiPresidentRoute() {
  return (
    <RequireAuth>
      <RouterStack.Screen options={{ gestureEnabled: false, fullScreenGestureEnabled: false }} />
      <Head>
        <title>{metatags.createTitle('Toi président')}</title>
      </Head>
      <Header title="Toi président" icon={Dices} navigation={{ showBackButton: true }} style={{ showOn: 'sm' }} />
      <Layout.Container hideTabBar>
        <ToiPresidentGameScreen />
      </Layout.Container>
    </RequireAuth>
  )
}
