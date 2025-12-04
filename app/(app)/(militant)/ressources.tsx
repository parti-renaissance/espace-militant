import React from 'react'
import { Redirect } from 'expo-router'
import { Link2 } from '@tamagui/lucide-icons'
import Layout from '@/components/AppStructure/Layout/Layout'
import Header from '@/components/AppStructure/Header'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import ResourcesList from '@/features_next/resources/pages/index'
import { useSession } from '@/ctx/SessionProvider'

export default function RessourcesPage() {
  const { isAuth } = useSession()
  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  return (
    <>
      <Header title="Ressources" icon={Link2} navigation={{ showBackButton: false }} style={{ showOn: 'sm' }} />
      <Layout.Container safeHorizontalPadding={false}>
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