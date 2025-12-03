import React from 'react'
import { Redirect } from 'expo-router'
import { HeartHandshake } from '@tamagui/lucide-icons'
import Layout from '@/components/AppStructure/Layout/Layout'
import Header from '@/components/AppStructure/Header'
import ReferralsScreen from '@/features_next/referrals/pages/index'
import { useSession } from '@/ctx/SessionProvider'

export default function ParrainagesPage() {
  const { isAuth } = useSession()
  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  return (
    <>
      <Header title="Parrainages" icon={HeartHandshake} navigation={{ showBackButton: false }} style={{ showOn: 'sm' }} />
      <Layout.Container safeHorizontalPadding={false}>
        <ReferralsScreen />
      </Layout.Container>
    </>
  )
}