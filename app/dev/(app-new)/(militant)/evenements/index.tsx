import React from 'react'
import Layout from '@/components/AppStructure/Layout/Layout'
import EventFeed from '@/features_next/events/pages/feed'

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