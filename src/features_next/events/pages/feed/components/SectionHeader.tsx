import { XStack } from 'tamagui'
import { ChevronDown } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'

type Props = {
  title: string
}

export const EventSectionHeader = ({ title }: Props) => (
  <XStack justifyContent="center" alignItems="center" gap="$small" pt="$small">
    <Text.MD semibold color="$gray4" textTransform="uppercase" textAlign="center">
      {title}
    </Text.MD>
    <ChevronDown size={20} color="$gray4" />
  </XStack>
)
