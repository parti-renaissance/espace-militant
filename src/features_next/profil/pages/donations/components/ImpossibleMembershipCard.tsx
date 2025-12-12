import React from 'react'
import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useGetDetailProfil } from '@/services/profile/hook'
import { XOctagon } from '@tamagui/lucide-icons'
import { XStack, YStack } from 'tamagui'
import PartyMembershipForm from '../../account/form/PartyMembershipFrom'
import type { CommonMembershipCardProps } from './types'

export default function (props: CommonMembershipCardProps & { full?: boolean }) {
  const { data } = useGetDetailProfil()
  return (
    <>
      <VoxCard bg="$orange1" inside>
        <VoxCard.Content pr="$large">
          <XStack gap="$small">
            <YStack gap="$medium" flex={1}>
              <VoxCard.Chip theme="orange" outlined>
                Adhésion impossible
              </VoxCard.Chip>
              <YStack flex={1}>
                <Text.MD semibold multiline>
                  La double adhésion n’étant pas permise par Renaissance, il ne vous est pas possible d’adhérer.
                </Text.MD>
              </YStack>
            </YStack>
            <YStack alignContent="center" height="100%" alignItems="center" justifyContent="center">
              <XOctagon size="$7" color="$orange6" strokeWidth={1} />
            </YStack>
          </XStack>
        </VoxCard.Content>
      </VoxCard>
      {props.full && <PartyMembershipForm profile={data} />}
    </>
  )
}
