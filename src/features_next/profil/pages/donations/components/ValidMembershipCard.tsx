import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'
import { getHumanFormattedDate } from '@/utils/date'
import { CheckCircle } from '@tamagui/lucide-icons'
import { XStack, YStack } from 'tamagui'
import type { CommonMembershipCardProps } from './types'

export default function (props: CommonMembershipCardProps) {
  return (
    <VoxCard bg="$blue1" inside>
      <VoxCard.Content pr="$large">
        <XStack gap="$small">
          <YStack gap="$medium" flex={1}>
            <XStack>
              <VoxCard.Chip theme="blue" outlined>
                Adhérent à jour
              </VoxCard.Chip>
            </XStack>
            <XStack>
              <YStack gap="$medium" flex={1}>
                <Text.MD semibold>Vous êtes à jour de cotisation</Text.MD>
                {props.last_membership_donation ? (
                  <Text.SM secondary>Dernière cotisation le {getHumanFormattedDate(props.last_membership_donation)}</Text.SM>
                ) : null}
              </YStack>
            </XStack>
          </YStack>
          <YStack justifyContent="center">
            <CheckCircle size="$7" color="$blue6" strokeWidth={1} />
          </YStack>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}
