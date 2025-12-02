import React from 'react'
import Layout from '@/components/Navigation/Layout'
import ResourcesList from '@/screens/tools/ResourcesList'
import Header from '@/components/Navigation/Header'
import { Link2 } from '@tamagui/lucide-icons'

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
    <Layout.Main maxWidth={992} >
      <ResourcesList />
    </Layout.Main>
  )
}