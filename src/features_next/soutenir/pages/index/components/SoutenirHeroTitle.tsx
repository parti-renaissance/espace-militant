import { YStack } from 'tamagui'

import Text from '@/components/base/Text'
import Title from '@/components/Title/Title'

export default function SoutenirHeroTitle() {
  return (
    <YStack gap="$medium">
      <Title size="h1" aria-label="Vous aussi, vous pouvez faire la différence">
        <Title.Text>VOUS AUSSI, VOUS POUVEZ</Title.Text>
        <Title.Break />
        <Title.Highlight>FAIRE LA DIFFÉRENCE</Title.Highlight>
      </Title>
      <Text.LG regular>
        <Text.LG semibold>Soutenir Gabriel Attal</Text.LG>, c‘est simple :
      </Text.LG>
    </YStack>
  )
}
