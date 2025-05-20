import { Component, useCallback, useRef, useState } from 'react'
import type { ScrollView as RNScrollView, View as RNView } from 'react-native'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb'
import VoxCard from '@/components/VoxCard/VoxCard'
import { ScrollView, View, XStack, YStack } from 'tamagui'
import { useGetProfil, useGetSuspenseProfil } from '@/services/profile/hook'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import Text from '@/components/base/Text'
import { useReferrals, useReferralScoreboard, useReferralStatistics } from '@/services/referral/hook'
import ReferralScoreCard from '@/features/referrals/components/ReferralScoreCard'
import StickyBox from '@/components/StickyBox/StickyBox'
import { findNodeHandle, StyleSheet } from 'react-native'
import ReferralsInviteCard from '../components/ReferralsInviteCard'
import ReferralsLinkCard from '../components/ReferralsLinkCard'
import ReferralsTrackingCard from '../components/ReferralsTrackingCard'
import ReferralsRankingCard from '../components/ReferralsRankingCard'
import ReferralLockedCard from '@/features/referrals/components/ReferralLockedCard'

const ReferralsDesktopScreenAllow = () => {
  const { data: scoreboard, isLoading: isLoadingScoreboard } = useReferralScoreboard()
  const { data: statistics, isLoading: isLoadingStatistics } = useReferralStatistics()
  const { data: user } = useGetProfil()

  const scrollViewRef = useRef<RNScrollView>(null)
  const rankingRef = useRef<RNView>(null)
  const trackingRef = useRef<RNView>(null)

  const scrollToRef = (ref: any) => {
    if (ref?.current) {
      ref.current.measureLayout(
        findNodeHandle(scrollViewRef.current as unknown as Component),
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y, animated: true })
        },
        () => { }
      )
    }
  }

  const [activeSection, setActiveSection] = useState<'cl' | 'suivi'>('cl')

  const handleScroll = useCallback((event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y

    if (rankingRef.current && trackingRef.current && scrollViewRef.current) {
      const scrollViewNode = findNodeHandle(scrollViewRef.current)
      if (!scrollViewNode) return

      rankingRef.current.measureLayout(
        scrollViewNode,
        (_x, yRanking) => {
          trackingRef.current?.measureLayout(
            scrollViewNode,
            (_x, yTracking) => {
              if (scrollY >= yTracking - 100) {
                setActiveSection('suivi')
              } else if (scrollY >= yRanking - 100) {
                setActiveSection('cl')
              }
            },
            () => { }
          )
        },
        () => { }
      )
    }
  }, [])


  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100, backgroundColor: '$textSurface' }}
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <View backgroundColor="$orange1" pt="$6" pb={48 + 32}>
        <View maxWidth={480} width="100%" margin="auto">
          <ReferralScoreCard
            fullName={`${user?.first_name ?? ''} ${user?.last_name ?? ''}`}
            rank={scoreboard?.global_rank}
            referralCount={statistics?.nb_referral_finished ?? 0}
            profileImage={user?.image_url}
          />
        </View>
      </View>
      <View mt={-48}>
        <View maxWidth={780} width="100%" margin="auto">
          <VoxCard>
            <VoxCard.Content>
              <XStack gap="$medium">
                <YStack flex={1}>
                  <ReferralsLinkCard />
                </YStack>
                <YStack>
                  <ReferralsInviteCard />
                </YStack>
              </XStack>
            </VoxCard.Content>
          </VoxCard>
        </View>
      </View>
      <XStack maxWidth={780} py="$medium" width="100%" margin="auto" height="auto">
        <StickyBox offsetTop="$xxlarge" offsetBottom="$medium">
          <View pl="$medium" pt="$medium" width={200}>
            <BreadCrumb
              items={[{ id: "cl", label: 'Classement' }, { id: "suivi", label: 'Suivi' }]}
              value={activeSection}
              vertical
              onChange={(value) => {
                if (value === 'cl') scrollToRef(rankingRef)
                if (value === 'suivi') scrollToRef(trackingRef)
              }}
            />
          </View>
        </StickyBox>
        <YStack gap="$medium" flex={1}>
          {/* Section Classement */}
          <YStack ref={rankingRef} gap="$medium">
            <YStack ref={rankingRef} gap="$medium">
              <ReferralsRankingCard title="National" data={scoreboard?.global} />
              <ReferralsRankingCard title={scoreboard?.assembly?.[0]?.assembly ?? 'Assemblée'} data={scoreboard?.assembly} />
            </YStack>
          </YStack>
          {/* Section Suivi */}
          <YStack flex={1} ref={trackingRef}>
            <ReferralsTrackingCard />
          </YStack>
        </YStack>
      </XStack>
    </ScrollView>
  )
}

export const ReferralsDesktopScreenDeny = () => {
  return (
    <View maxWidth={580} width="100%" mx="auto" mt="$medium">
      <ReferralLockedCard/>
    </View>
  )
}

export const ReferralsDesktopScreenSkeleton = () => {
  return (
    <SkeCard>
      <SkeCard.Image></SkeCard.Image>
    </SkeCard>
  )
}

const ReferralsDesktopScreen = () => {
  const { data } = useGetSuspenseProfil()
  return data?.tags?.find((tag) => tag.code.startsWith('adherent:'))
    ? <ReferralsDesktopScreenAllow />
    : <ReferralsDesktopScreenDeny />
}

const Screen = (props) => {
  return (
    <BoundarySuspenseWrapper fallback={<ReferralsDesktopScreenSkeleton />}>
      <ReferralsDesktopScreen {...props} />
    </BoundarySuspenseWrapper>
  )
}

export default Screen