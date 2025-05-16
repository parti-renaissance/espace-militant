import React from 'react'
import ScrollView from '@/features/profil/components/ScrollView'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { useReferralScoreboard } from '@/services/referral/hook'
import ReferralScoreboardTable from './components/ReferralScoreboardTable'
import { VoxButton } from '@/components/Button'
import Text from '@/components/base/Text'
import { HeartHandshake } from '@tamagui/lucide-icons'
import VoxCard from '@/components/VoxCard/VoxCard'
import { Link } from 'expo-router'

export default function ReferralsScoreboardPage() {
  const { data: scoreboard, isLoading: isLoadingScoreboard } = useReferralScoreboard()

  if (isLoadingScoreboard || !scoreboard) {
    return (
      <ScrollView>
        <Skeleton />
      </ScrollView>
    )
  }

  return (
    <ScrollView>
      <VoxCard gap="$medium" overflow='hidden'>
        <VoxCard.Content>
          <Text.LG bold>Campagne de parrainage</Text.LG>
          <Text.MD>Participez à notre grande campagne de {'\n'}parrainage jusqu’au 15 juillet !</Text.MD>
          <Link href="/profil/parrainages">
            <VoxButton theme='orange' backgroundColor='$orange9' iconLeft={HeartHandshake} width='100%' size='lg'>
              Faire un premier parrainage
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