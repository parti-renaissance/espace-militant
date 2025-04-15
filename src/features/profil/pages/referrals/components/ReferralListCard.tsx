import React, { Fragment } from 'react'
import { Platform } from 'react-native'
import Text from '@/components/base/Text'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import StatsCard from '@/components/StatsCard/StatsCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import ReferralListEmptyState from '@/features/profil/pages/referrals/components/ReferralListEmptyState'
import ReferralListItem from '@/features/profil/pages/referrals/components/ReferralListItem'
import { useReferrals, useReferralStatistics } from '@/services/referral/hook'
import i18n from '@/utils/i18n'
import { Separator, XStack, YStack } from 'tamagui'

export default function ReferralListCard() {
  const { data, isLoading } = useReferrals()
  const { data: statistics, isLoading: isLoadingStatistics } = useReferralStatistics()

  if (isLoading || !data) {
    return <Skeleton />
  }

  return (
    <VoxCard>
      <VoxCard.Content>
        <Text.LG fontWeight={600}>Suivi des parrainages</Text.LG>

        {data.items.length === 0 ? (
          <ReferralListEmptyState />
        ) : (
          <>
            <XStack alignItems={'center'} alignContent={'space-between'} width={'100%'} gap={'$3'}>
              <XStack flex={1}>
                <StatsCard
                  count={statistics?.nb_referral_finished ?? 0}
                  label={i18n.t('referral.finished', { count: statistics?.nb_referral_finished })}
                  backgroundColor={'$green1'}
                  color={'$green5'}
                  isLoading={isLoadingStatistics}
                />
              </XStack>
              <XStack flex={1} justifyContent={'center'}>
                <StatsCard
                  count={statistics?.nb_referral_sent ?? 0}
                  label={i18n.t('referral.sent', { count: statistics?.nb_referral_sent })}
                  backgroundColor={'$gray1'}
                  color={'$gray5'}
                  isLoading={isLoadingStatistics}
                />
              </XStack>
              <XStack flex={1} justifyContent={'flex-end'}>
                <StatsCard
                  count={statistics?.nb_referral_reported ?? 0}
                  label={i18n.t('referral.reported', { count: statistics?.nb_referral_reported })}
                  backgroundColor={'$orange1'}
                  color={'$orange5'}
                  isLoading={isLoadingStatistics}
                />
              </XStack>
            </XStack>

            <YStack padding={'$medium'} borderRadius={'$4'} backgroundColor={'$gray1'}>
              {data.items.map((item, index) => (
                <Fragment key={item.uuid}>
                  <ReferralListItem item={item} />
                  {index !== data.items.length - 1 && <SeparatorComponent />}
                </Fragment>
              ))}
            </YStack>
          </>
        )}
      </VoxCard.Content>
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
