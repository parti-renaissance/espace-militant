import React, { Fragment } from 'react'
import { FlatList, Platform } from 'react-native'
import Text from '@/components/base/Text'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import StatsCard from '@/components/StatsCard/StatsCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import ReferralListItem from '@/features/profil/pages/referrals/components/ReferralListItem'
import { useReferrals } from '@/services/referral/hook'
import { Separator, XStack, YStack } from 'tamagui'

export default function ReferralListCard() {
  const { data, isLoading } = useReferrals()

  if (isLoading || !data) {
    return <Skeleton />
  }

  return (
    <VoxCard padding={'$8'}>
      <>
        <Text.LG fontWeight={600}>Suivi des parrainages</Text.LG>

        <XStack alignItems={'center'} alignContent={'space-between'} width={'100%'} gap={'$3'}>
          <XStack flex={1}>
            <StatsCard count={8} label={'Adhésions\nfinalisées'} backgroundColor={'$green1'} color={'$green5'} />
          </XStack>
          <XStack flex={1} justifyContent={'center'}>
            <StatsCard count={8} label={'Invitations\nenvoyées'} backgroundColor={'$gray1'} color={'$gray5'} />
          </XStack>
          <XStack flex={1} justifyContent={'flex-end'}>
            <StatsCard count={8} label={'Invitations\nsignalées'} backgroundColor={'$orange1'} color={'$orange5'} />
          </XStack>
        </XStack>
      </>

      <YStack padding={'$8'} borderRadius={'$4'} backgroundColor={'$gray1'}>
        {data.items.map((item, index) => (
          <Fragment key={item.uuid}>
            <ReferralListItem item={item} />
            {index !== data.items.length - 1 && <SeparatorComponent />}
          </Fragment>
        ))}
      </YStack>
    </VoxCard>
  )
}

const SeparatorComponent = () => <Separator borderStyle={Platform.OS === 'ios' ? 'solid' : 'dashed'} borderColor={'#DCE0E4'} marginVertical={'$4'} />

const Skeleton = () => (
  <SkeCard>
    <SkeCard.Content>
      <SkeCard.Description />
      <SkeCard.Description />
      <SkeCard.Description />
      <SkeCard.Description />
    </SkeCard.Content>
  </SkeCard>
)
