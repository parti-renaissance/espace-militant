import { XStack, YStack } from 'tamagui';



import Text from '@/components/base/Text';

const SUGGESTIONS = ['Que propose Gabriel Attal contre la canicule ?']

type Props = {
  onPress: (question: string) => void
}

export function SuggestionsList({ onPress }: Props) {
  return (
    <YStack gap="$small" width="100%" alignItems="flex-end">
      {SUGGESTIONS.map((q) => (
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
