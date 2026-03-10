import React from 'react'
import { YStack } from 'tamagui'

import Text from '@/components/base/Text'

export function MilitantFilterPanel() {
  return (
    <YStack padding="$medium" gap="$medium">
      <Text.LG semibold>Filtres</Text.LG>
      <Text.SM secondary>Contenu des filtres à venir.</Text.SM>
    </YStack>
  )
}
