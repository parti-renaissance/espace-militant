import { useCallback, useRef, useState } from 'react'
import type { LayoutRectangle, NativeScrollEvent, NativeSyntheticEvent, ScrollView as RNScrollView, View as RNView } from 'react-native'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb'
import VoxCard from '@/components/VoxCard/VoxCard'
import { ScrollView, View, XStack, YStack } from 'tamagui'
import { useGetProfil, useGetSuspenseProfil } from '@/services/profile/hook'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { useReferralScoreboard, useReferralStatistics } from '@/services/referral/hook'
import ReferralScoreCard from '@/features/referrals/components/ReferralScoreCard'
import StickyBox from '@/components/StickyBox/StickyBox'
import ReferralsInviteCard from '../components/ReferralsInviteCard'
import ReferralsLinkCard from '../components/ReferralsLinkCard'
import ReferralsTrackingCard from '../components/ReferralsTrackingCard'
import ReferralsRankingCard, { ReferralsRankingCardLoading } from '../components/ReferralsRankingCard'
import ReferralLockedCard from '@/features/referrals/components/ReferralLockedCard'
import { ListTodo, Medal } from '@tamagui/lucide-icons'

const ReferralsDesktopScreenAllow = () => {
  const { data: scoreboard, isLoading: isLoadingScoreboard } = useReferralScoreboard()
  const { data: statistics, isLoading: isLoadingStatistics } = useReferralStatistics()
  const { data: user } = useGetProfil()

  const [activeSection, setActiveSection] = useState('cl')

  const scrollViewRef = useRef<RNScrollView>(null)
  const rankingLayout = useRef<LayoutRectangle | null>(null)
  const trackingLayout = useRef<LayoutRectangle | null>(null)

  if (isLoadingScoreboard && isLoadingStatistics) {
    return (
      <ReferralsDesktopScreenSkeleton />
    )
  }
  
  const scrollToLayout = (layout: LayoutRectangle | null) => {
    if (layout && scrollViewRef?.current) {
      scrollViewRef.current.scrollTo({ y: layout.y, animated: true })
    }
  }

  const scrollToRanking = () => scrollToLayout(rankingLayout?.current)
  const scrollToTracking = () => scrollToLayout(trackingLayout?.current)

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y

    const rankingY = rankingLayout.current?.y ?? 0
    const trackingY = trackingLayout.current?.y ?? 0

    if (scrollY >= trackingY - 100) {
      setActiveSection('suivi')
    } else if (scrollY >= rankingY - 100) {
      setActiveSection('cl')
    }
  }, [])

  const isInTop5National = (scoreboard?.global_rank ?? Infinity) <= 5
  const hasAssemblyRanking = (scoreboard?.assembly?.length ?? 0) >= 3
  const shouldShowAssemblyFirst = !isInTop5National && hasAssemblyRanking


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
            globalRank={!shouldShowAssemblyFirst ? scoreboard?.global_rank : undefined}
            assemblyRank={shouldShowAssemblyFirst ? scoreboard?.assembly_rank : undefined}
            nbReferralFinished={statistics?.nb_referral_finished ?? 0}
            nbReferralSent={statistics?.nb_referral_sent ?? 0}
            assemblyName={scoreboard?.assembly?.[0]?.assembly ?? undefined}
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
              items={[{ id: "cl", label: 'Classement', icon: <Medal size={16} /> }, { id: "suivi", label: 'Suivi', icon: <ListTodo size={16} /> }]}
              value={activeSection}
              vertical
              onChange={(value) => {
                if (value === 'cl') scrollToRanking()
                if (value === 'suivi') scrollToTracking()
              }}
            />
          </View>
        </StickyBox>
        <YStack gap="$medium" flex={1}>
          {/* Section Classement */}
          <YStack onLayout={(e) => { rankingLayout.current = e.nativeEvent.layout }} gap="$medium">
            <YStack gap="$medium">
              {shouldShowAssemblyFirst ? (
                <>
                  <ReferralsRankingCard
                    title={scoreboard?.assembly?.[0]?.assembly ?? 'Assemblée'}
                    data={scoreboard?.assembly}
                  />
                  <ReferralsRankingCard title="National" data={scoreboard?.global} />
                </>
              ) : (
                <>
                  <ReferralsRankingCard title="National" data={scoreboard?.global} />
                  {hasAssemblyRanking && (
                    <ReferralsRankingCard
                      title={scoreboard?.assembly?.[0]?.assembly ?? 'Assemblée'}
                      data={scoreboard?.assembly}
                    />
                  )}
                </>
              )}
            </YStack>
          </YStack>
          {/* Section Suivi */}
          <YStack flex={1} onLayout={(e) => { trackingLayout.current = e.nativeEvent.layout }}>
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
      <ReferralLockedCard />
    </View>
  )
}

export const ReferralsDesktopScreenSkeleton = () => {
  return (
    <View
      style={{ paddingBottom: 100, backgroundColor: '$textSurface' }}
    >
      <View backgroundColor="$orange1" pt="$6" pb={48 + 32}>
        <View maxWidth={480} width="100%" margin="auto">
          <SkeCard height={280}>
            <SkeCard.Content>
              <SkeCard.Image />
              <SkeCard.Line width="100%" />
            </SkeCard.Content>
          </SkeCard>
        </View>
      </View>
      <View mt={-48}>
        <View maxWidth={780} width="100%" margin="auto">
          <VoxCard>
            <VoxCard.Content>
              <XStack gap="$medium">
                <YStack flex={1}>
                  <SkeCard>
                    <SkeCard.Image />
                  </SkeCard>
                </YStack>
                <YStack flex={1}>
                  <SkeCard>
                    <SkeCard.Image />
                  </SkeCard>
                </YStack>
              </XStack>
            </VoxCard.Content>
          </VoxCard>
        </View>
      </View>
      <XStack maxWidth={780} py="$medium" width="100%" margin="auto" height="auto">
        <StickyBox offsetTop="$xxlarge" offsetBottom="$medium">
          <View pr="$medium" width={200}>
            <SkeCard>
              <SkeCard.Content>
                <SkeCard.Line width={100} />
                <SkeCard.Line width={100} />
              </SkeCard.Content>
            </SkeCard>
          </View>
        </StickyBox>
        <YStack gap="$medium" flex={1}>
          {/* Section Classement */}
          <YStack gap="$medium">
            <YStack gap="$medium">
              <ReferralsRankingCardLoading />
            </YStack>
          </YStack>
          {/* Section Suivi */}
          <YStack flex={1}>
            <ReferralsRankingCardLoading />
          </YStack>
        </YStack>
      </XStack>
    </View>
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