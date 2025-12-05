import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'
import Error404 from '@/components/404/Error404'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import Layout from '@/components/AppStructure/Layout/Layout'
import * as metatags from '@/config/metatags'
import { isEventEditable } from '@/features_next/events/utils'
import EventFormScreen, { EventFormScreenSkeleton } from '@/features_next/events/pages/create-edit'
import { useGetEvent } from '@/services/events/hook'
import { RestFullEvent } from '@/services/events/schema'

const EditEventScreen: React.FC = () => {
  
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
