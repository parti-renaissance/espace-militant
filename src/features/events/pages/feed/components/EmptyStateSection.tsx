import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import EmptyEvent from '@/features/events/components/EmptyEvent'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { Sparkle } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'
import { Image, isWeb, XStack, YStack } from 'tamagui'

// eslint-disable-next-line
const EventIllustration = require('@/features/events/assets/images/event_illustration.png')

export const EmptyStateSection = () => {
  const { hasFeature } = useGetExecutiveScopes()
  if (hasFeature('events') === false) {
    return (
      <VoxCard.Content paddingTop="$xxlarge">
        <XStack flex={1}>
          <EmptyEvent />
        </XStack>
      </VoxCard.Content>
    )
  }
  return (
    <VoxCard.Content padding="$xlarge">
      <YStack gap="$large" alignItems="center">
        <Image src={EventIllustration} />
        <Text.MD secondary>Aucun événement à venir</Text.MD>
        <XStack>
          <Link href="/evenements/creer" asChild={!isWeb}>
            <VoxButton variant="outlined" size="md" theme="purple" iconLeft={Sparkle}>
              J’en organise un
            </VoxButton>
          </Link>
        </XStack>
      </YStack>
    </VoxCard.Content>
  )
}
