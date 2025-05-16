import React from 'react'
import { XStack, YStack } from 'tamagui'
import Text from '@/components/base/Text'
import ProfilePicture from '@/components/ProfilePicture'
import { ReferralScoreboardItemType } from '@/services/referral/schema'

type ReferralScoreboardTableProps = {
  data: ReferralScoreboardItemType[]
}

export default function ReferralScoreboardTable({ data }: ReferralScoreboardTableProps) {
  return (
    <YStack>
      <XStack gap="$medium" p="$large" justifyContent="space-between">
        <Text fontSize="$1" flexShrink={0}>
          Rang
        </Text>
        <Text fontSize="$1" flexGrow={1}>
          Parrain
        </Text>
        <Text fontSize="$1" flexShrink={0}>
          Adhésions parrainées
        </Text>
      </XStack>

      {data.map((entry, index) => {
        const rowBackground = entry.is_current_user  ? '$orange1' : index % 2 ? '$white1' : '$textSurface'

        return (
          <XStack
            key={`${entry.position}-${index}`}
            gap="$medium"
            py="$small"
            px="$large"
            justifyContent="space-between"
            backgroundColor={rowBackground}
            alignItems="center"
          >
            <Text width="$large" textAlign="center" color="$textPrimaire" flexShrink={0}>
              {entry.position}
            </Text>

            <XStack gap="$medium" flexGrow={1} alignItems="center" minWidth={0}>
              <ProfilePicture
                fullName={`${entry.first_name} ${entry.last_name}`}
                alt="profile picture"
                size="$4"
                rounded
                backgroundColor="$gray1"
                textColor="$textDisabled"
              />
              <Text color="$textPrimaire" numberOfLines={1} ellipsizeMode="tail">
                {`${entry.first_name} ${entry.last_name}`}
              </Text>
            </XStack>

            <Text color="$textPrimaire" flexShrink={0}>
              {entry.referrals_count}
            </Text>
          </XStack>
        )
      })}
    </YStack>
  )
}
