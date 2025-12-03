import { useCallback, useMemo, useRef, useState } from 'react'
import type { LayoutRectangle, NativeScrollEvent, NativeSyntheticEvent, ScrollView as RNScrollView } from 'react-native'
import { ScrollView, View, XStack, YStack, useMedia } from 'tamagui'
import { ListTodo, Medal } from '@tamagui/lucide-icons'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb'
import VoxCard from '@/components/VoxCard/VoxCard'
import Text from '@/components/base/Text'
import StickyBox from '@/components/StickyBox/StickyBox'
import type { RestProfilResponse } from '@/services/profile/schema'
import type { ReferralScoreboardType, ReferralStatisticsType } from '@/services/referral/schema'
import { ReferralScoreCard, ReferralsInviteCard, ReferralsLinkCard, ReferralsTrackingCard, ReferralsRankingCard } from '@/features_next/referrals/components/Cards'

type ReferralsContentProps = {
  user?: RestProfilResponse
  scoreboard?: ReferralScoreboardType
  statistics?: ReferralStatisticsType
}

export function ReferralsDesktopContent({ user, scoreboard, statistics }: ReferralsContentProps) {

  const [activeSection, setActiveSection] = useState('cl')

  const scrollViewRef = useRef<RNScrollView>(null)
  const rankingLayout = useRef<LayoutRectangle | null>(null)
  const trackingLayout = useRef<LayoutRectangle | null>(null)

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

  const assemblyTitle = useMemo(() => {
    const assembly = scoreboard?.assembly?.[0]
    return assembly?.assembly_name && assembly?.assembly_code
      ? `${assembly.assembly_name} (${assembly.assembly_code})`
      : 'Assemblée'
  }, [scoreboard?.assembly])

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
      <View backgroundColor="$orange1" pt="$6" pb={52}>
        <View maxWidth={480} width="100%" margin="auto">
          <ReferralScoreCard
            fullName={`${user?.first_name ?? ''} ${user?.last_name ?? ''}`}
            globalRank={!shouldShowAssemblyFirst ? scoreboard?.global_rank : undefined}
            assemblyRank={shouldShowAssemblyFirst ? scoreboard?.assembly_rank : undefined}
            nbReferralFinished={statistics?.nb_referral_finished ?? 0}
            nbReferralSent={statistics?.nb_referral_sent ?? 0}
            assemblyName={scoreboard?.assembly?.[0]?.assembly_name ?? undefined}
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
              items={[
                { id: 'cl', label: 'Classement', icon: <Medal size={16} /> },
                { id: 'suivi', label: 'Suivi', icon: <ListTodo size={16} /> },
              ]}
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
                  <ReferralsRankingCard title={assemblyTitle} data={scoreboard?.assembly} />
                  <ReferralsRankingCard title="National" data={scoreboard?.global} />
                </>
              ) : (
                <>
                  <ReferralsRankingCard title="National" data={scoreboard?.global} />
                  {hasAssemblyRanking && (
                    <ReferralsRankingCard title={assemblyTitle} data={scoreboard?.assembly} />
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

export function ReferralsMobileContent({ user, scoreboard, statistics }: ReferralsContentProps) {

  const [activeSection, setActiveSection] = useState<'cl' | 'suivi'>('cl')

  const assemblyTitle = useMemo(() => {
    const assembly = scoreboard?.assembly?.[0]
    return assembly?.assembly_name && assembly?.assembly_code
      ? `${assembly.assembly_name} (${assembly.assembly_code})`
      : 'Assemblée'
  }, [scoreboard?.assembly])

  const isInTop5National = (scoreboard?.global_rank ?? Infinity) <= 5
  const hasAssemblyRanking = (scoreboard?.assembly?.length ?? 0) >= 3
  const shouldShowAssemblyFirst = !isInTop5National && hasAssemblyRanking

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100, backgroundColor: '$textSurface' }}>
      <View backgroundColor="$white1" mb="$xxlarge">
        <View maxWidth={480} width="100%" margin="auto" px="$medium" gap="$medium" py="$medium">
          <Text.MD>Participez à notre grande campagne de parrainage.</Text.MD>
          <ReferralScoreCard
            fullName={`${user?.first_name ?? ''} ${user?.last_name ?? ''}`}
            globalRank={!shouldShowAssemblyFirst ? scoreboard?.global_rank : undefined}
            assemblyRank={shouldShowAssemblyFirst ? scoreboard?.assembly_rank : undefined}
            nbReferralFinished={statistics?.nb_referral_finished ?? 0}
            nbReferralSent={statistics?.nb_referral_sent ?? 0}
            assemblyName={scoreboard?.assembly?.[0]?.assembly_name ?? undefined}
            profileImage={user?.image_url}
          />
          <ReferralsLinkCard />
          <ReferralsInviteCard />
        </View>
      </View>
      <YStack>
        <View>
          <BreadCrumb
            items={[
              { id: 'cl', label: 'Classement', icon: <Medal size={16} /> },
              { id: 'suivi', label: 'Suivi', icon: <ListTodo size={16} /> },
            ]}
            value={activeSection}
            onChange={(v) => { setActiveSection(v) }}
          />
        </View>
        <View gap="$medium">
          {activeSection === 'cl' && (
            <View gap="$medium">
              {shouldShowAssemblyFirst ? (
                <>
                  <ReferralsRankingCard title={assemblyTitle} data={scoreboard?.assembly} />
                  <ReferralsRankingCard title="National" data={scoreboard?.global} />
                </>
              ) : (
                <>
                  <ReferralsRankingCard title="National" data={scoreboard?.global} />
                  {hasAssemblyRanking && (
                    <ReferralsRankingCard title={assemblyTitle} data={scoreboard?.assembly} />
                  )}
                </>
              )}
            </View>
          )}
          {activeSection === 'suivi' && (
            <View>
              <ReferralsTrackingCard />
            </View>
          )}
        </View>
      </YStack>
    </ScrollView>
  )
}

export function ReferralsContent({ user, scoreboard, statistics }: ReferralsContentProps) {
  const media = useMedia()
  return media.gtSm ? (
    <ReferralsDesktopContent user={user} scoreboard={scoreboard} statistics={statistics} />
  ) : (
    <ReferralsMobileContent user={user} scoreboard={scoreboard} statistics={statistics} />
  )
}

