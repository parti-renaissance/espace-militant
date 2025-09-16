import React from 'react'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import MyProfileCard from '@/components/ProfileCards/ProfileCard/MyProfileCard'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import * as metatags from '@/config/metatags'
import ResourcesList from '@/screens/tools/ResourcesList'
import Head from 'expo-router/head'
import { useMedia, View, YStack } from 'tamagui'

const RessourceCardSkeleton = () => {
  const media = useMedia()
  return (
    <SkeCard borderColor="gray2" flex={media.gtSm ? 1 : undefined} borderRadius="$8">
      <SkeCard.Content>
        <YStack height="$8" />
        <SkeCard.Description />
      </SkeCard.Content>
    </SkeCard>
  )
}

const DoubleRessourceCardSkeleton = () => {
  const media = useMedia()
  return (
    <YStack gap="$medium" flexDirection={media.gtSm ? 'row' : undefined}>
      <RessourceCardSkeleton />
      <RessourceCardSkeleton />
    </YStack>
  )
}

const ToolsSkeleton = () => {
  const media = useMedia()
  return (
    <YStack gap="$medium" padding="$medium" paddingTop={media.sm ? '$medium' : undefined}>
      <DoubleRessourceCardSkeleton />
      <DoubleRessourceCardSkeleton />
      <DoubleRessourceCardSkeleton />
    </YStack>
  )
}

const ToolsScreen: React.FC = () => {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Ressources')}</title>
      </Head>

      <PageLayout>
        <PageLayout.SideBarLeft>
          <View gap={'$small'}>
            <MyProfileCard />
          </View>
        </PageLayout.SideBarLeft>
        <PageLayout.MainSingleColumn>
          <BoundarySuspenseWrapper fallback={<ToolsSkeleton />}>
            <ResourcesList />
          </BoundarySuspenseWrapper>
        </PageLayout.MainSingleColumn>
      </PageLayout>
    </>
  )
}

export default ToolsScreen
