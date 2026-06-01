import { YStack } from 'tamagui'

import Text from '@/components/base/Text'
import Title from '@/components/Title/Title'

export default function SignupInscriptionHeader() {
  return (
    <YStack gap="$medium">
      <Title>
        <Title.Text>On fait</Title.Text>
        <Title.Highlight>connaissance</Title.Highlight>
        <Title.Text>?</Title.Text>
      </Title>
      <Text.LG regular>
        Quelques infos pour <Text.LG semibold>personnaliser votre app.</Text.LG>
      </Text.LG>
    </YStack>
  )
}
