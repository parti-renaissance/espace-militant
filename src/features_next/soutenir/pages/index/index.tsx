import { useMedia, XStack, YStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'

import { useGetProfil } from '@/services/profile/hook'

import SoutenirCallToActionCards from './components/SoutenirCallToActionCards'
import SoutenirContactNationalButton from './components/SoutenirContactNationalButton'
import SoutenirHeroImage from './components/SoutenirHeroImage'
import SoutenirHeroTitle from './components/SoutenirHeroTitle'

type SoutenirScreenProps = {
  isSm: boolean
  userId?: string
}

function SoutenirDesktopScreen({ isSm, userId }: SoutenirScreenProps) {
  return (
    <XStack flexDirection="row" gap="$large">
      <YStack flex={1} maxWidth={424} gap="$large" flexShrink={0}>
        <SoutenirHeroTitle />
        <SoutenirHeroImage isDesktop isSm={isSm} />
        <SoutenirContactNationalButton userId={userId} />
      </YStack>

      <YStack flex={1} maxWidth={424}>
        <SoutenirCallToActionCards userId={userId} />
      </YStack>
    </XStack>
  )
}

function SoutenirMobileScreen({ isSm, userId }: SoutenirScreenProps) {
  return (
    <YStack gap="$large">
      <SoutenirHeroImage isDesktop={false} isSm={isSm} />
      <YStack gap="$large" px={isSm ? '$medium' : 0}>
        <SoutenirHeroTitle />
        <SoutenirCallToActionCards userId={userId} />
        <SoutenirContactNationalButton userId={userId} />
      </YStack>
    </YStack>
  )
}

export default function SoutenirScreen() {
  const media = useMedia()
  const { data: user } = useGetProfil()
  const userId = user?.id
  const isSm = media.sm

  return (
    <Layout.Container>
      <Layout.Main maxWidth={892}>
        <LayoutScrollView padding={isSm ? { top: false } : true}>
          <YStack backgroundColor="$gray50" p={isSm ? 0 : '$medium'}>
            {media.gtMd ? <SoutenirDesktopScreen isSm={isSm} userId={userId} /> : <SoutenirMobileScreen isSm={isSm} userId={userId} />}
          </YStack>
        </LayoutScrollView>
      </Layout.Main>
    </Layout.Container>
  )
}
