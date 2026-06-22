import { ScrollView, useMedia, XStack, YStack } from 'tamagui'

import { AuthRoutes, getAuthHref } from '@/features_next/signup/utils/authNavigation'

import PronoCtaSection from '../../components/PronoCtaSection'
import PronoHeroSection from '../../components/PronoHeroSection'
import PronoMatchCard from '../../components/PronoMatchCard'
import PronoNavHeader from '../../components/PronoNavHeader'
import { useCurrentPronoMatch } from '../../hooks/useCurrentPronoMatch'
import { PRONO_PAGE_COPY } from '../../model'

export default function PronoPublicScreen() {
  const media = useMedia()
  const { match } = useCurrentPronoMatch()
  const ctaHref = getAuthHref(AuthRoutes.BIENVENUE, '/prono')
  const isDesktop = media.gtSm

  const content = (
    <YStack
      width="100%"
      maxWidth={isDesktop ? 480 : undefined}
      paddingHorizontal={isDesktop ? '$large' : '$medium'}
      paddingVertical={isDesktop ? '$xlarge' : '$medium'}
      gap="$medium"
    >
      <PronoHeroSection />
      <PronoMatchCard match={match} />
      <PronoCtaSection label={PRONO_PAGE_COPY.cta} href={ctaHref} />
    </YStack>
  )

  if (isDesktop) {
    return (
      <XStack flex={1} backgroundColor="$gray50">
        <ScrollView flex={1} contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          {content}
        </ScrollView>
      </XStack>
    )
  }

  return (
    <ScrollView flex={1} backgroundColor="$gray50" contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
      <PronoNavHeader />
      {content}
    </ScrollView>
  )
}
