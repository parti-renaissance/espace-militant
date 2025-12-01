import React from 'react'
import Layout from '@/components/Navigation/Layout'
import HomeFeed from '@/features/homefeed/HomeFeed'

export default function AccueilPage() {
  return (
    <Layout.Container>
      <AccueilContent />
    </Layout.Container>
  )
}

function AccueilContent() {

  return (
    <HomeFeed />
  )
}