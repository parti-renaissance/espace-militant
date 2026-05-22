import { useTranslation } from 'react-i18next'
import { View } from 'tamagui'

import Text from '@/components/base/Text'

export function BotDisclaimer() {
  const { t } = useTranslation()
  return (
    <View paddingHorizontal="$medium" paddingTop="$small">
      <Text.SM secondary regular multiline textAlign="center" fontSize={11} lineHeight={16}>
        {t('bot.disclaimer')}
      </Text.SM>
    </View>
  )
}

export default BotDisclaimer
