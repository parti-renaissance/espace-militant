import { YStack } from 'tamagui'

import { VoxButton } from '@/components/Button'
import Title from '@/components/Title/Title'

type BienvenueTitleAndCtaProps = {
  onContinue: () => void
}

export default function BienvenueTitleAndCta({ onContinue }: BienvenueTitleAndCtaProps) {
  return (
    <YStack gap="$large" width="100%" maxWidth={420} alignItems="center">
      <Title>
        <Title.Text>Et si on changeait</Title.Text>
        <Title.Break />
        <Title.Text>les choses</Title.Text>
        <Title.Highlight>Ensemble</Title.Highlight>
        <Title.Text>?</Title.Text>
      </Title>

      <YStack width="100%">
        <VoxButton theme="blue" size="xl" full onPress={onContinue}>
          Suivant
        </VoxButton>
      </YStack>
    </YStack>
  )
}
