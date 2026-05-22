import { useTranslation } from 'react-i18next'
import { XStack, YStack } from 'tamagui'

import Text from '@/components/base/Text'

type Props = {
  onPress: (question: string) => void
}

export function SuggestionsList({ onPress }: Props) {
  const { t } = useTranslation()
  const suggestions = [t('bot.suggestions.q1'), t('bot.suggestions.q2')]

  return (
    <YStack gap="$small" width="100%" alignItems="flex-end">
      {suggestions.map((q) => (
        <XStack
          key={q}
          onPress={() => onPress(q)}
          cursor="pointer"
          backgroundColor="$blue1"
          borderColor="$blue4"
          borderWidth={1}
          borderRadius={999}
          px="$medium"
          py="$small"
          alignItems="center"
          hoverStyle={{ backgroundColor: '$blue2' }}
          pressStyle={{ backgroundColor: '$blue3', opacity: 0.9 }}
        >
          <Text.MD color="$blue7" semibold fontSize={14} lineHeight={14} letterSpacing={0}>
            {q}
          </Text.MD>
        </XStack>
      ))}
    </YStack>
  )
}

export default SuggestionsList
