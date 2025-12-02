import React from 'react'
import Layout from '@/components/Navigation/Layout'
import ResourcesList from '@/features_next/resources/pages/index'
import Header from '@/components/Navigation/Header'
import { Link2 } from '@tamagui/lucide-icons'
import LayoutScrollView from '@/components/Navigation/LayoutScrollView'

export default function RessourcesPage() {
  return (
    <>
      <Header title="Ressources" icon={Link2} navigation={{ showBackButton: false }} style={{ showOn: 'sm' }} />
      <Layout.Container>
        <RessourcesContent />
      </Layout.Container>
    </>
  )
}

function RessourcesContent() {
  return (
    <>
      <LayoutScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <Layout.Main maxWidth={992}>
          <ResourcesList />
        </Layout.Main>
      </LayoutScrollView>
    </>
  )
}