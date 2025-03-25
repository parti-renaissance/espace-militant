import Text from '@/components/base/Text'
import StatsCard from '@/components/StatsCard/StatsCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import { XStack } from 'tamagui'

export default function ReferralListCard() {
  return (
    <VoxCard padding={'$8'}>
      <Text.LG fontWeight={600}>Suivi des parrainages</Text.LG>

      <XStack alignItems={'center'} alignContent={'space-between'} width={'100%'} gap={'$3'}>
        <XStack flex={1}>
          <StatsCard count={8} label={'Adhésions finalisées'} backgroundColor={'$green1'} color={'$green5'} />
        </XStack>
        <XStack flex={1} justifyContent={'center'}>
          <StatsCard count={8} label={'Invitations envoyées'} backgroundColor={'$gray1'} color={'$gray5'} />
        </XStack>
        <XStack flex={1} justifyContent={'flex-end'}>
          <StatsCard count={8} label={'Invitations signalées'} backgroundColor={'$orange1'} color={'$orange5'} />
        </XStack>
      </XStack>
    </VoxCard>
  )
}
