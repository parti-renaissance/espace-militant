import React from 'react'
import { HeartHandshake } from '@tamagui/lucide-icons'
import Layout from '@/components/AppStructure/Layout/Layout'
import Header from '@/components/AppStructure/Header'
import ReferralsScreen from '@/features_next/referrals/pages/index'

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