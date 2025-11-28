import React from 'react'
import { Text } from 'tamagui'
import Layout from '@/components/Navigation/Layout'

export default function PublicationsPage() {
  return (
    <Layout.Container>
      <PublicationsContent />
    </Layout.Container>
  )
}

function PublicationsContent() {
  return (
    <Layout.Main maxWidth={992}>
      <Text>Publications</Text>
    </Layout.Main>
  )
}

