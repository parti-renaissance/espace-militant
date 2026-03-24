import { View, YStack } from 'tamagui'
import { Bot } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'

export function NewChat() {
  return (
    <YStack flex={1} width="100%" minHeight="100%" justifyContent="center" alignItems="center" p="$medium">
      <YStack width="100%" maxWidth={520} alignItems="center" gap="$xlarge">
        <View alignSelf="center" justifyContent="center" padding="$medium" borderRadius={100} backgroundColor="$textOutline">
          <Bot size={44} color="$blue9" />
        </View>
        <YStack gap="$medium">
          <Text.LG primary semibold textAlign="center">
            Commencez une nouvelle conversation
          </Text.LG>
          <Text.MD secondary multiline regular textAlign="center">
            Posez n'importe quelle question ou sélectionnez un agent préconçu pour démarrer.
          </Text.MD>
        </YStack>
      </YStack>
    </YStack>
  )
}
