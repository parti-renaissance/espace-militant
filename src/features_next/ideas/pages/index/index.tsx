import { useMedia, YStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'

import { useGetProfil } from '@/services/profile/hook'

import IdeesHeroTitle from './components/IdeesHeroTitle'
import IdeesSecondaryCards from './components/IdeesSecondaryCards'

export default function IdeesScreen() {
  const media = useMedia()
  const { data: user } = useGetProfil()
  const userId = user?.id
  const isSm = media.sm
  const isDesktop = media.gtSm

  return (
    <Layout.Main maxWidth={892} paddingLeft={isDesktop ? 24 : 0} paddingRight={isDesktop ? 24 : 0}>
      <LayoutScrollView padding={isSm ? { top: false } : true}>
        <YStack p={isSm ? '$medium' : 0} backgroundColor="$gray50" gap="$large">
          <IdeesHeroTitle />
          <IdeesSecondaryCards userId={userId} isDesktop={isDesktop} />
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}
