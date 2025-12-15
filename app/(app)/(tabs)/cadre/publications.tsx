import React, { useCallback } from 'react'
import { useRouter } from 'expo-router'
import Layout from '@/components/AppStructure/Layout/Layout'
import PublicationsScreen from '@/features_next/publications/pages/list'
import Head from 'expo-router/head'
import * as metatags from '@/config/metatags'
import { Header } from '@/components/AppStructure'
import { VoxButton } from '@/components/Button'
import { Sparkle } from '@tamagui/lucide-icons'

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

