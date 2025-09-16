import { useReferralStatistics, useReferrals } from '@/services/referral/hook'
import StatsCard from '@/components/StatsCard/StatsCard'
import Text from '@/components/base/Text'
import { VoxCard } from '@/components/VoxCard/VoxCard'
import { useMedia, View, XStack, YStack } from 'tamagui'
import i18n from '@/utils/i18n'
import ReferralListEmptyState from '@/features/referrals/components/ReferralListEmptyState'
import ReferralListItem from '@/features/referrals/components/ReferralListItem'

const ReferralsTrackingCard = () => {
  const { data: referrals } = useReferrals()
  const { data: statistics, isLoading } = useReferralStatistics()
  const media = useMedia()

  return (
    <VoxCard>
      <VoxCard.Content>
        {referrals?.items.length === 0 ? (
          <ReferralListEmptyState />
        ) : (
          <>
            <Text.MD semibold display={media.sm ? 'none' : undefined}>Suivi des parrainages</Text.MD>
            <XStack alignItems="center" gap="$medium">
              <XStack flex={1}>
                <StatsCard
                  count={statistics?.nb_referral_finished ?? 0}
                  label={i18n.t('referral.finished', { count: statistics?.nb_referral_finished })}
                  backgroundColor="$green1"
                  color="$green5"
                  isLoading={isLoading}
                />
              </XStack>
              <XStack flex={1} justifyContent="center">
                <StatsCard
                  count={statistics?.nb_referral_sent ?? 0}
                  label={i18n.t('referral.sent', { count: statistics?.nb_referral_sent })}
                  backgroundColor="$gray1"
                  color="$gray5"
                  isLoading={isLoading}
                />
              </XStack>
              <XStack flex={1} justifyContent="flex-end">
                <StatsCard
                  count={statistics?.nb_referral_reported ?? 0}
                  label={i18n.t('referral.reported', { count: statistics?.nb_referral_reported })}
                  backgroundColor="$orange1"
                  color="$orange5"
                  isLoading={isLoading}
                />
              </XStack>
            </XStack>

            <YStack borderRadius="$4">
              {referrals?.items.map((item, index) => (
                <View
                  key={item.uuid}
                  backgroundColor={index % 2 ? '$white1' : '$textSurface'}
                  p="$medium"
                >
                  <ReferralListItem item={item} />
                </View>
              ))}
            </YStack>
          </>
        )}
      </VoxCard.Content>
    </VoxCard>
  )
}

export default ReferralsTrackingCard
