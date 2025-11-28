import React from 'react'
import { View, Text, styled } from 'tamagui'
import Layout from '@/components/Navigation/Layout'
import ResourcesList from '@/screens/tools/ResourcesList'

const CenterContainer = styled(View, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
})

const RouteName = styled(Text, {
  fontSize: '$8',
  fontWeight: 'bold',
  color: '$textPrimary',
})

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