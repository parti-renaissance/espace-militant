import React, { useMemo } from 'react'
import Text from '@/components/base/Text'
import { ReferralStatusEnum, ReferralType, TypeReferralEnum } from '@/services/referral/schema'
import { getHumanFormattedDateShort } from '@/utils/date'
import { capitalize } from 'lodash'
import { XStack, YStack } from 'tamagui'

interface Props {
  item: ReferralType
}

const lineHeight = 20

export default function ReferralListItem({ item }: Readonly<Props>) {
  const color = useMemo(() => {
    switch (item.status) {
      case ReferralStatusEnum.ACCOUNT_CREATED:
        return '$orange9'
      case ReferralStatusEnum.ADHESION_FINISHED:
        return '$green6'
      case ReferralStatusEnum.ADHESION_VIA_OTHER_LINK:
        return '$gray4'
      case ReferralStatusEnum.INVITATION_SENT:
        return '$gray6'
      case ReferralStatusEnum.REPORTED:
        return '$orange6'
      default:
        return ''
    }
  }, [item.status])

  const referralType = useMemo(() => {
    switch (item.type) {
      case TypeReferralEnum.INVITATION:
        return 'Invitation'
      case TypeReferralEnum.PREREGISTRATION:
        return 'Préinscription'
      case TypeReferralEnum.LINK:
        return 'Lien'
      default:
        return ''
    }
  }, [item.type])

  return (
    <XStack justifyContent="space-between" alignItems="center" gap="$4">
      <YStack flex={1} minWidth={0}>
        <Text fontWeight="500" lineHeight={lineHeight}>
          {capitalize(item.first_name)} {item.last_name && capitalize(item.last_name)}
        </Text>

        <Text color="$textSecondary" lineHeight={lineHeight}>
          {referralType} • {getHumanFormattedDateShort(item.created_at)}
        </Text>

        <Text color="$textDisabled" lineHeight={lineHeight} numberOfLines={1} ellipsizeMode="tail">
          {item.email_address}
        </Text>

        {item.phone && (
          <Text color="$textDisabled" numberOfLines={1} ellipsizeMode="tail">
            {item.phone}
          </Text>
        )}
      </YStack>

      <YStack alignItems="flex-end" flexShrink={0} minWidth={100}>
        <Text color={color} lineHeight={lineHeight} fontWeight={500}>
          {item.status_label}
        </Text>
        {item.updated_at && (
          <Text color="$textSecondary" lineHeight={lineHeight}>
            {getHumanFormattedDateShort(item.updated_at)}
          </Text>
        )}
      </YStack>
    </XStack>

  )
}
