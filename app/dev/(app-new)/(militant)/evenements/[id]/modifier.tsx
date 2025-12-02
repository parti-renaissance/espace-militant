import React from 'react'
import Error404 from '@/components/404/Error404'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import Layout from '@/components/Navigation/Layout'
import * as metatags from '@/config/metatags'
import EventFormScreen, { EventFormScreenSkeleton } from '@/features_next/events/pages/create-edit'
import { isEventEditable } from '@/features/events/utils'
import { useGetEvent } from '@/services/events/hook'
import { RestFullEvent } from '@/services/events/schema'
import { useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'
import { useHideTabBar } from '@/components/Navigation/LayoutContext'

const EditEventScreen: React.FC = () => {
  useHideTabBar()
  
  return (
    <Layout.Container>
      <BoundarySuspenseWrapper fallback={<EventFormScreenSkeleton editMode />}>
        <_EventFormScreen />
      </BoundarySuspenseWrapper>
    </Layout.Container>
  )
}

function _EventFormScreen() {
  const params = useLocalSearchParams<{ id: string }>()
  if (!params.id) return <Error404 />
  const { data } = useGetEvent({ id: params.id })
  if (!isEventEditable(data)) return <Error404 />
  return (
    <>
      <Head>
        <title>{metatags.createTitle(`Modifier : ${data.name.slice(0, 5)}..${data.name.slice(5, 5)}`)}</title>
      </Head>
      <EventFormScreen edit={data as RestFullEvent} />
    </>
  )
}

export default EditEventScreen
