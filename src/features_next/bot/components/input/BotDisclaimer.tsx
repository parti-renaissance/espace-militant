import { View } from 'tamagui'

import Text from '@/components/base/Text'

export function BotDisclaimer() {
  return (
    <View paddingHorizontal="$medium" paddingTop="$small">
      <Text.SM secondary regular multiline textAlign="center" fontSize={11} lineHeight={16}>
        Les réponses sont générées par IA et peuvent contenir des erreurs. Vérifiez les informations importantes.
      </Text.SM>
    </View>
  )
}

export default BotDisclaimer
