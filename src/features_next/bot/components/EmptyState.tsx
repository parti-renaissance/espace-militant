import { useTranslation } from 'react-i18next'
import { View, YStack } from 'tamagui'
import { BotMessageSquare } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'

export function EmptyState() {
  const { t } = useTranslation()
  const intro = `${t('bot.newChatTitle')} ${t('bot.newChatDescription')}`

  return (
    <YStack flex={1} width="100%" minHeight="100%" justifyContent="center" alignItems="center" p="$medium">
      <YStack width="100%" maxWidth={520} alignItems="center" gap="$large">
        <View justifyContent="center" alignItems="center" padding={16} borderRadius={100} backgroundColor="$textOutline">
          <BotMessageSquare size={32} color="$blue9" />
        </View>
        <Text.LG primary semibold multiline textAlign="center">
          {intro}
        </Text.LG>
      </YStack>
    </YStack>
  )
}

export default EmptyState
