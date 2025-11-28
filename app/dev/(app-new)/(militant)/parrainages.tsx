import React from 'react'
import { View, Text, styled } from 'tamagui'
import Layout from '@/components/Navigation/Layout'

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

export default function ParrainagesPage() {
  return (
    <Layout.Container>
      <ParrainagesContent />
    </Layout.Container>
  )
}

function ParrainagesContent() {
  return (
    <Layout.Main>
      <CenterContainer>
        <RouteName>Parrainages</RouteName>
      </CenterContainer>
    </Layout.Main>
  )
}