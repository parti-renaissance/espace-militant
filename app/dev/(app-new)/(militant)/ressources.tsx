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

export default function RessourcesPage() {
  return (
    <Layout.ScrollView safeArea>
      <Layout.Container>
        <Layout.Main>
          <CenterContainer>
            <RouteName>Ressources</RouteName>
          </CenterContainer>
        </Layout.Main>
      </Layout.Container>
    </Layout.ScrollView>
  )
}

