import React from 'react'
import ScrollView from '@/features/profil/components/ScrollView'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { useReferralScoreboard, useReferralStatistics } from '@/services/referral/hook'
import ReferralScoreboardTable from './components/ReferralScoreboardTable'
import { VoxButton } from '@/components/Button'
import Text from '@/components/base/Text'
import { HeartHandshake } from '@tamagui/lucide-icons'
import VoxCard from '@/components/VoxCard/VoxCard'
import { Link } from 'expo-router'
import ReferralScoreCard from './components/ReferralScoreCard'
import { useGetProfil } from '@/services/profile/hook'

export default function ReferralsScoreboardPage() {
  const { data: scoreboard, isLoading: isLoadingScoreboard } = useReferralScoreboard()
  const { data: statistics, isLoading: isLoadingStatistics } = useReferralStatistics()
  const { data: user } = useGetProfil()

  if ((isLoadingScoreboard && isLoadingStatistics) || !scoreboard) {
    return (
      <ScrollView>
        <Skeleton />
      </ScrollView>
    )
  }

  return (
    <ScrollView pb='$xxxlarge'>
      <VoxCard gap="$medium" overflow='hidden'>
        <VoxCard.Content>
          <Text.LG bold>Campagne de parrainage</Text.LG>
          <Text.MD>Participez à notre grande campagne de {'\n'}parrainage jusqu’au 15 juillet !</Text.MD>
          <ReferralScoreCard
            fullName={`${user?.first_name ?? ''} ${user?.last_name ?? ''}`}
            rank={scoreboard.global_rank}
            referralCount={statistics?.nb_referral_finished ?? 0}
            profileImage={user?.image_url}
          />
          <Link href="/profil/parrainages" asChild>
            <VoxButton theme='orange' backgroundColor='$orange9' iconLeft={HeartHandshake} width='100%' size='lg'>
              Parrainer une nouvelle adhésion
            </VoxButton>
          </Link>
        </VoxCard.Content>
        <ReferralScoreboardTable data={scoreboard.global} />
      </VoxCard>
    </ScrollView>
  )
}


const Skeleton = () => (
  <SkeCard>
    <SkeCard.Content>
      <SkeCard.Title />
      <SkeCard.Line width='50%' />
      <SkeCard.Button width='100%' />
      <SkeCard.Image />
    </SkeCard.Content>
  </SkeCard>
)