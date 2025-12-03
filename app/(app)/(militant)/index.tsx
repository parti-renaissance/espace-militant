import React from 'react'
import { Redirect } from 'expo-router'
import Layout from '@/components/AppStructure/Layout/Layout'
import HomeFeed from '@/features/homefeed/HomeFeed'
import { useSession } from '@/ctx/SessionProvider'


export default function AccueilPage() {
  const { isAuth } = useSession()
  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }
  
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