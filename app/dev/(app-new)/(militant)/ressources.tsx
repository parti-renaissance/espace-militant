import React from 'react'
import Layout from '@/components/Navigation/Layout'
import ResourcesList from '@/screens/tools/ResourcesList'

export default function RessourcesPage() {
  return (
    <Layout.Container>
      <RessourcesContent />
    </Layout.Container>
  )
}

function RessourcesContent() {
  return (
    <Layout.Main maxWidth={992}>
      <ResourcesList />
    </Layout.Main>
  )
}