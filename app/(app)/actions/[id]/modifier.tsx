import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'

import Error404 from '@/components/404/Error404'
import Layout from '@/components/AppStructure/Layout/Layout'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { ActionForm, ActionFormScreenSkeleton } from '@/features_next/actions'

import * as metatags from '@/config/metatags'
import { useAction } from '@/services/actions/hook'
import { RestActionFull } from '@/services/actions/schema'

const EditActionScreen: React.FC = () => {
  return (
    <Layout.Container hideSideBar hideTabBar>
      <BoundarySuspenseWrapper fallback={<ActionFormScreenSkeleton editMode />}>
        <EditActionInner />
      </BoundarySuspenseWrapper>
    </Layout.Container>
  )
}

function EditActionInner() {
  const params = useLocalSearchParams<{ id: string }>()
  if (!params.id) return <Error404 />
  const { data } = useAction({ id: params.id })
  // TODO: remove this once the backend is updated
  // if (!data.editable) return <Error404 />

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Modifier une action')}</title>
      </Head>
      <ActionForm edit={data as RestActionFull} />
    </>
  )
}

export default EditActionScreen
