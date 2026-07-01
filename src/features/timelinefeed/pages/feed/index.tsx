import { ScrollView, useMedia, YStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import BoundarySuspenseWrapper, { DefaultErrorFallback } from '@/components/BoundarySuspenseWrapper'
import AppDownloadCTA, { type AppDownloadCTASize } from '@/components/ProfileCards/AppDownloadCTA/AppDownloadCTA'
import { MyProfileCardNoLinks } from '@/components/ProfileCards/ProfileCard/MyProfileCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import { TimelineFeedMain } from './components/TimelineFeedMain'
import { TimelineFeedMainSkeleton, TimelineFeedSidebarSkeleton } from './components/TimelineFeedSkeleton'

import { useSession } from '@/ctx/SessionProvider'

export { TimelineFeedMainSkeleton, TimelineFeedSidebarSkeleton }

export default function TimelineFeedPage() {
  const media = useMedia()
  const { isAuth } = useSession()
  const appDownloadSize: AppDownloadCTASize = isAuth ? 'medium' : 'large'

  return (
    <>
      <Layout.Main>
        <BoundarySuspenseWrapper fallback={<TimelineFeedMainSkeleton />}>
          <TimelineFeedMain />
        </BoundarySuspenseWrapper>
      </Layout.Main>

      {media.gtMd ? (
        <Layout.SideBar isSticky>
          <BoundarySuspenseWrapper
            fallback={<TimelineFeedSidebarSkeleton />}
            errorChildren={(error) => (
              <YStack justifyContent="center" alignItems="center" gap="$medium">
                <VoxCard justifyContent="center" alignItems="center" flex={1} width="100%">
                  <VoxCard.Content justifyContent="center" alignItems="center">
                    <DefaultErrorFallback {...error} />
                  </VoxCard.Content>
                </VoxCard>
                <AppDownloadCTA size={appDownloadSize} />
              </YStack>
            )}
          >
            <ScrollView contentContainerStyle={{ height: '100dvh' }}>
              <YStack alignItems="center" justifyContent="center" gap="$medium">
                <MyProfileCardNoLinks />
                <AppDownloadCTA size={appDownloadSize} />
              </YStack>
            </ScrollView>
          </BoundarySuspenseWrapper>
        </Layout.SideBar>
      ) : null}
    </>
  )
}
