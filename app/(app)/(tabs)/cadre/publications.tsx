import React, { useCallback } from 'react'
import { useRouter } from 'expo-router'
import Head from 'expo-router/head'
import { Sparkle } from '@tamagui/lucide-icons'

import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import { VoxButton } from '@/components/Button'
import PublicationsScreen from '@/features_next/publications/pages/list'

import * as metatags from '@/config/metatags'

export default function PublicationsPage() {
  const router = useRouter()

  const handleCreatePublication = useCallback(() => {
    router.push('/publications')
  }, [router])

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Mes Publications')}</title>
      </Head>
      <Header
        title="Mes Publications"
        navigation={{ showBackButton: false }}
        rightComponent={
          <VoxButton variant="soft" theme="purple" iconLeft={Sparkle} size="lg" onPress={handleCreatePublication}>
            Nouvelle publication
          </VoxButton>
        }
      />
      <Layout.Container sidebarState="cadre">
        <PublicationsScreen />
      </Layout.Container>
    </>
  )
}
