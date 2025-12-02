import React from 'react'
import { View, Text, styled } from 'tamagui'
import Layout from '@/components/Navigation/Layout'
import EventFeed from '@/features_next/events/pages/feed'

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

export default function EvenementsPage() {
  return (
    <Layout.Container>
      <EvenementsContent />
    </Layout.Container>
  )
}

function EvenementsContent() {
  return (
    <EventFeed />
  )
}