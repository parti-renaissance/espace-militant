import React from 'react'
import Error404 from '@/components/404/Error404'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import * as metatags from '@/config/metatags'
import { GeneralConventionsDenyCard } from '@/screens/generalConventions/components/DenyCard'
import DetailsScreen from '@/screens/generalConventions/components/DetailsScreen'
import { useDataStore } from '@/screens/generalConventions/store'
import { useGetSuspenseProfil } from '@/services/profile/hook'
import { Stack as RouterStack, useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'
import { YStack } from 'tamagui'

const HomeScreen: React.FC = () => {
  const params = useLocalSearchParams<{ id: string }>()
  const data = useDataStore((state) => state.selectedData)

  if (!params.id) {
    return <Error404 />
  }

  return (
    <PageLayout webScrollable>
      <BoundarySuspenseWrapper>
        <EventDetailScreen data={data} />
      </BoundarySuspenseWrapper>
      <PageLayout.SideBarRight maxWidth={177} />
    </PageLayout>
  )
}

function EventDetailScreen({ data }) {
  const { data: user } = useGetSuspenseProfil()
  const isAdherent = user?.tags?.find((tag) => tag.type === 'adherent')

  if (!isAdherent) {
    return (
      <YStack justifyContent={'center'} alignItems={'center'} width="100%" height="100%">
        <GeneralConventionsDenyCard topVisual={0} />
      </YStack>
    )
  }

  if (null === data) {
    return <Error404 />
  }

  const title = `États généraux • ${data?.department_zone?.name} (${data?.department_zone?.code})`

  return (
    <>
      <RouterStack.Screen
        options={{
          title,
        }}
      />
      <Head>
        <title>{metatags.createTitle(title)}</title>
      </Head>
      <DetailsScreen data={data} />
    </>
  )
}

export default HomeScreen
