import React from 'react'
import { useMedia, XStack, YStack } from 'tamagui'

import Text from '@/components/base/Text'

export function MilitantListHeader() {
  const media = useMedia()

  if (media.sm) {
    return null
  }

  return (
    <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$medium">
      <YStack flex={1} gap="$small">
        <Text.LG semibold>Mes militants</Text.LG>
        <Text.SM secondary>Consultez et gérez les militants de votre périmètre</Text.SM>
      </YStack>
    </XStack>
  )
}
