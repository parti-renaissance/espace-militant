import React from 'react'
import { useLocalSearchParams } from 'expo-router'

import Error404 from '@/components/404/Error404'
import Layout from '@/components/AppStructure/Layout/Layout'
import { ActionDetailPage } from '@/features_next/actions/pages/detail'

const ActionDetailRoute: React.FC = () => {
  const params = useLocalSearchParams<{ id: string }>()

  if (!params.id) return <Error404 />

  return (
    <Layout.Container hideTabBar>
      <ActionDetailPage id={params.id} />
    </Layout.Container>
  )
}

export default ActionDetailRoute
