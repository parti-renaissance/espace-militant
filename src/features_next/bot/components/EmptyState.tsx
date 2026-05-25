import { View, YStack } from 'tamagui'
import { BotMessageSquare } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'

export function EmptyState() {
  return (
    <YStack flex={1} width="100%" minHeight="100%" justifyContent="center" alignItems="center" p="$medium">
      <YStack width="100%" maxWidth={520} alignItems="center" gap="$large">
        <View justifyContent="center" alignItems="center" padding={16} borderRadius={100} backgroundColor="$textOutline">
          <BotMessageSquare size={32} color="$blue9" />
        </View>
        <Text.LG primary semibold multiline textAlign="center">
          Éducation, économie, écologie… Sur quel sujet souhaitez-vous connaître nos propositions ?
        </Text.LG>
      </YStack>
    </YStack>
  )
}

export default EmptyState
