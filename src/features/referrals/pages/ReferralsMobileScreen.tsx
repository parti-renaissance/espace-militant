import { useRef, useState } from 'react'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb'
import VoxCard from '@/components/VoxCard/VoxCard'
import { getTokenValue, ScrollView, View, XStack, YStack } from 'tamagui'
import { useGetProfil, useGetSuspenseProfil } from '@/services/profile/hook'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import Text from '@/components/base/Text'
import { useReferrals, useReferralScoreboard, useReferralStatistics } from '@/services/referral/hook'
import ReferralScoreCard from '@/features/referrals/components/ReferralScoreCard'
import ReferralsLinkCard from '../components/ReferralsLinkCard'
import ReferralsInviteCard from '../components/ReferralsInviteCard'
import ReferralsRankingCard from '../components/ReferralsRankingCard'
import ReferralsTrackingCard from '../components/ReferralsTrackingCard'
import { ListTodo, Medal } from '@tamagui/lucide-icons'
import ReferralLockedCard from '@/features/referrals/components/ReferralLockedCard'

const ReferralsMobileScreenAllow = () => {
  const { data: referrals } = useReferrals()
  const { data: scoreboard, isLoading: isLoadingScoreboard } = useReferralScoreboard()
  const { data: statistics, isLoading: isLoadingStatistics } = useReferralStatistics()
  const { data: user } = useGetProfil()

  const [activeSection, setActiveSection] = useState<'cl' | 'suivi'>('cl')

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100, backgroundColor: '$textSurface' }}>
      <View backgroundColor="$white1"  mb="$xxlarge">
      <View maxWidth={480} width="100%" margin="auto" px="$medium" gap="$medium" py="$medium">
          <Text.MD>Participez à notre grande campagne de{'\n'}parrainage jusqu’à la rentrée !</Text.MD>
          <ReferralScoreCard
            fullName={`${user?.first_name ?? ''} ${user?.last_name ?? ''}`}
            rank={scoreboard?.global_rank}
            referralCount={statistics?.nb_referral_finished ?? 0}
            profileImage={user?.image_url}
          />
          <ReferralsLinkCard />
          <ReferralsInviteCard />
        </View>
      </View>
      <YStack>
        <View>
          <BreadCrumb
            items={[{ id: "cl", label: 'Classement', icon: <Medal size={16} /> }, { id: "suivi", label: 'Suivi', icon: <ListTodo size={16} /> }]}
            value={activeSection}
            onChange={(v) => { setActiveSection(v) }}
          />
        </View>
        <View gap="$medium">
          { activeSection === 'cl' && (
            <View gap="$medium">
              <ReferralsRankingCard title="National" data={scoreboard?.global} />
              <ReferralsRankingCard title={scoreboard?.assembly?.[0]?.assembly ?? 'Assemblée'} data={scoreboard?.assembly} />
            </View>
          )}
          { activeSection === 'suivi' && (
            <View>
              <ReferralsTrackingCard />
            </View>
          )}
        </View>
      </YStack>
    </ScrollView>
  )
}

export const ReferralsMobileScreenDeny = () => {
  return (
    <View maxWidth={580} width="100%" mx="auto" mt="$medium">
      <ReferralLockedCard/>
    </View>
  )
}

export const ReferralsMobileScreenSkeleton = () => {
  return (
    <SkeCard>
      <SkeCard.Image></SkeCard.Image>
    </SkeCard>
  )
}

const ReferralsMobileScreen = () => {
  const { data } = useGetSuspenseProfil()
  return data?.tags?.find((tag) => tag.code.startsWith('adherent:'))
    ? <ReferralsMobileScreenAllow />
    : <ReferralsMobileScreenDeny />
}

const Screen = (props) => {
  return (
    <BoundarySuspenseWrapper fallback={<ReferralsMobileScreenSkeleton />}>
      <ReferralsMobileScreen {...props} />
    </BoundarySuspenseWrapper>
  )
}

export default Screen
