import { Image } from 'expo-image'
import { XStack, YStack } from 'tamagui'

import Text from '@/components/base/Text'
import Title from '@/components/Title/Title'

import toiPresidentThumbnail from '../assets/toi-president-thumbnail.png'

export function ToiPresidentEngagementCard() {
  return (
    <YStack bg="$purple200" borderColor="$purple500" borderWidth={1} padding="$medium" borderRadius="$medium" gap="$small">
      <XStack gap="$medium" alignItems="center">
        <Image source={toiPresidentThumbnail} style={{ height: 76, aspectRatio: 1, borderRadius: 8 }} contentFit="cover" cachePolicy="memory-disk" />
        <YStack gap="$small" flexShrink={1}>
          <Title size="h2">
            <Title.Text>Toi Président - Le Jeu</Title.Text>
          </Title>
          <Text.SM>150 propositions de réformes issues du débat public, que feriez-vous si vous étiez Président ?</Text.SM>
        </YStack>
      </XStack>
    </YStack>
  )
}
