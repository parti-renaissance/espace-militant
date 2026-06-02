import React, { useMemo } from 'react'
import { Link, Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import Head from 'expo-router/head'
import { useMedia, XStack } from 'tamagui'
import { QrCode } from '@tamagui/lucide-icons'

import Layout from '@/components/AppStructure/Layout/Layout'
import Text from '@/components/base/Text'
import FutureButton from '@/components/Buttons/FutureButton'
import { ProfileNav, VoxHeader } from '@/components/Header/Header'
import SignupCongartsModal from '@/features_next/signup/components/SignupCongartsModal'
import TimelineFeedScreen from '@/features_next/timelinefeed/TimelineFeedScreen'

import EuCampaignIllustration from '@/assets/illustrations/EuCampaignIllustration'
import * as metatags from '@/config/metatags'
import { useSession } from '@/ctx/SessionProvider'
import { useGetUserScopes } from '@/services/profile/hook'

const HomeHeader = () => {
  const media = useMedia()

  if (media.gtSm) {
    return null
  }

  return (
    <VoxHeader justifyContent="space-between" backgroundColor="$textSurface" borderWidth={0}>
      <XStack flex={1} flexBasis={0}>
        <Link href="/" replace>
          <EuCampaignIllustration cursor="pointer" />
        </Link>
      </XStack>
      <ProfileNav flex={1} flexBasis={0} justifyContent="flex-end" />
    </VoxHeader>
  )
}

export default function AccueilPage() {
  const { isAuth } = useSession()
  const router = useRouter()
  const { signupCongrats, firstName } = useLocalSearchParams<{ signupCongrats?: '1'; firstName?: string }>()
  const { data: userScopes } = useGetUserScopes({ enabled: true })
  const hasScannerScope = useMemo(() => userScopes?.some((s) => s.code === 'meeting_scanner') ?? false, [userScopes])
  const closeSignupCongratsModal = () => {
    router.setParams({ signupCongrats: undefined, firstName: undefined })
  }

  const floatingContent = useMemo(() => {
    if (!hasScannerScope) return null
    return (
      <FutureButton onPress={() => router.push('/scanner')}>
        <XStack alignItems="center" gap={8}>
          <QrCode size={20} color="white" />
          <Text.LG regular color="white">
            Scanner un billet
          </Text.LG>
        </XStack>
      </FutureButton>
    )
  }, [hasScannerScope, router])

  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Plateforme')}</title>
      </Head>
      <HomeHeader />
      <Layout.Container floatingContent={floatingContent}>
        <SignupCongartsModal isOpen={signupCongrats === '1'} firstName={firstName} onClose={closeSignupCongratsModal} />
        <TimelineFeedScreen />
      </Layout.Container>
    </>
  )
}
