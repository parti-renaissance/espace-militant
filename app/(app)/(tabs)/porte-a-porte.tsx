import React from 'react'
import Head from 'expo-router/head'
import { YStack } from 'tamagui'
import { DoorOpen } from '@tamagui/lucide-icons'

import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import { ContentBackButton } from '@/components/ContentBackButton'
import { RequireAuth } from '@/components/RequireAuth'
import DoorToDoorScreenPage from '@/screens/doorToDoor/DoorToDoorScreenPage'

import * as metatags from '@/config/metatags'

export default function PorteAPortePage() {
  return (
    <RequireAuth>
      <Head>
        <title>{metatags.createTitle('Porte à porte')}</title>
      </Head>
      <Header title="Porte à porte" icon={DoorOpen} navigation={{ showBackButton: true }} style={{ showOn: 'sm' }} />
      <Layout.Container safeHorizontalPadding={false}>
        <YStack flex={1}>
          <ContentBackButton fallbackPath="/" />
          <DoorToDoorScreenPage embeddedInLayout />
        </YStack>
      </Layout.Container>
    </RequireAuth>
  )
}
