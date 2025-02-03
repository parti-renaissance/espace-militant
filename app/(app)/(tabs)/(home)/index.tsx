import React from 'react'
// import { Text } from 'react-native'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import AppDownloadCTA from '@/components/ProfileCards/AppDownloadCTA/AppDownloadCTA'
import MyProfileCard from '@/components/ProfileCards/ProfileCard/MyProfileCard'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import StickyBox from '@/components/StickyBox/StickyBox'
import * as metatags from '@/config/metatags'
import HomeFeedList from '@/features/homefeed/HomeFeedList'
import ScopeModal from '@/features/ScopesSelector'
import Head from 'expo-router/head'
import { YStack } from 'tamagui'

const HomeScreen: React.FC = () => {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Le fil')}</title>
      </Head>
      <PageLayout webScrollable>
        <PageLayout.SideBarLeft>
          <StickyBox offsetTop="$medium" offsetBottom="$medium">
            <YStack gap="$medium">
              <MyProfileCard />
            </YStack>
          </StickyBox>
        </PageLayout.SideBarLeft>
        <PageLayout.MainSingleColumn>
          <BoundarySuspenseWrapper
            fallback={
              <YStack gap="$medium" padding="$medium" $sm={{ paddingHorizontal: 0 }}>
                <SkeCard>
                  <SkeCard.Content>
                    <SkeCard.Chip />
                    <SkeCard.Title />
                    <SkeCard.Description />
                    <SkeCard.Description />
                    <SkeCard.Description />
                    <SkeCard.Actions />
                  </SkeCard.Content>
                </SkeCard>
                <SkeCard>
                  <SkeCard.Content>
                    <SkeCard.Chip />
                    <SkeCard.Image />
                    <SkeCard.Title />
                    <SkeCard.Date />
                    <SkeCard.Author />
                    <SkeCard.Author />
                    <SkeCard.Actions />
                  </SkeCard.Content>
                </SkeCard>
                <SkeCard>
                  <SkeCard.Content>
                    <SkeCard.Chip />
                    <SkeCard.Title />
                    <SkeCard.Description />
                    <SkeCard.Description />
                    <SkeCard.Actions />
                  </SkeCard.Content>
                </SkeCard>
                <SkeCard>
                  <SkeCard.Content>
                    <SkeCard.Chip />
                    <SkeCard.Title />
                    <SkeCard.Date />
                    <SkeCard.Author />
                    <SkeCard.Author />
                    <SkeCard.Actions />
                  </SkeCard.Content>
                </SkeCard>
              </YStack>
            }
          >
            <ScopeModal />
            <HomeFeedList />
          </BoundarySuspenseWrapper>
        </PageLayout.MainSingleColumn>
        <PageLayout.SideBarRight>
          <StickyBox offsetTop="$medium" offsetBottom="$xlarge">
            <YStack>
              <AppDownloadCTA />
            </YStack>
          </StickyBox>
        </PageLayout.SideBarRight>
      </PageLayout>
    </>
  )
}

export default HomeScreen
