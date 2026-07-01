import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getTokenValue, isWeb, useMedia, XStack } from 'tamagui'
import { CirclePlus } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'

type EventsListOrganizeFabProps = {
  onPress: () => void
}

export function EventsListOrganizeFab({ onPress }: EventsListOrganizeFabProps) {
  const media = useMedia()
  const insets = useSafeAreaInsets()
  const organizeFabBottom = Math.max(getTokenValue('$medium', 'space'), insets.bottom)

  if (!media.sm) {
    return null
  }

  return (
    <XStack position={isWeb ? 'fixed' : 'absolute'} bottom={organizeFabBottom} right="$medium" zIndex={20} gap="$small" pointerEvents="box-none">
      <VoxButton variant="contained" size="lg" iconLeft={CirclePlus} theme="pink" onPress={onPress}>
        Organiser un événement
      </VoxButton>
    </XStack>
  )
}
