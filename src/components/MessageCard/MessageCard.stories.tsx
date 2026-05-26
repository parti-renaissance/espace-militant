import { Calendar } from '@tamagui/lucide-icons'
import { ScrollView, Stack, YStack } from 'tamagui'
import { MessageCard } from './MessageCard'

export default {
  title: 'MessageCard',
  component: MessageCard,
}

export function Default() {
  const colors = ['gray', 'pink', 'orange', 'blue', 'green', 'yellow'] as const

  return (
    <ScrollView flex={1} alignContent="center" justifyContent="center">
      <Stack gap="$medium">
        <YStack gap="$small">
          {colors.map((c) => (
            <MessageCard key={c} theme={c} iconLeft={Calendar}>
              Label
            </MessageCard>
          ))}
        </YStack>
      </Stack>
    </ScrollView>
  )
}
