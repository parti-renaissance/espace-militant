import React from 'react'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import MobileWall from '@/components/MobileWall/MobileWall'
import AppDownloadCTA from '@/components/ProfileCards/AppDownloadCTA/AppDownloadCTA'
import ProcurationCTA from '@/components/ProfileCards/ProcurationCTA/ProcurationCTA'
import MyProfileCard from '@/components/ProfileCards/ProfileCard/MyProfileCard'
import { useMedia, YStack } from 'tamagui'

/**
 * This layout should be presented if platform is web and action occur only on mobile app.
 * In exemple for the door to door.
 */
export default function MobileWallLayout() {
  const { gtMd } = useMedia()

  return (
    <PageLayout>
      <PageLayout.SideBarLeft>
        <YStack gap="$medium">
          <MyProfileCard />
        </YStack>
      </PageLayout.SideBarLeft>
      <PageLayout.MainSingleColumn>
        {gtMd ? (
          <YStack p={'$xlarge'}>
            <AppDownloadCTA size="large" />
          </YStack>
        ) : (
          <PageLayout.StateFrame paddingHorizontal={'$medium'}>
            <MobileWall />
          </PageLayout.StateFrame>
        )}
      </PageLayout.MainSingleColumn>
      <PageLayout.SideBarRight>
        <ProcurationCTA />
      </PageLayout.SideBarRight>
    </PageLayout>
  )
}
