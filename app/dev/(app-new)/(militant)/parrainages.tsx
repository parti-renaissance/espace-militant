import React from 'react'
import Layout from '@/components/Navigation/Layout'
import ReferralsScreen from '@/features_next/referrals/pages/index'
import Header from '@/components/Navigation/Header'
import { HeartHandshake } from '@tamagui/lucide-icons'

export default function ParrainagesPage() {
  return (
    <>
      <Header title="Parrainages" icon={HeartHandshake} navigation={{ showBackButton: false }} style={{ showOn: 'sm' }} />
      <Layout.Container>
        <ReferralsScreen />
      </Layout.Container>
    </>
  )
}