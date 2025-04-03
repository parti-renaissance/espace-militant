import React from 'react'
import Text from '@/components/base/Text'
import { Copy } from '@tamagui/lucide-icons'
import { XStack } from 'tamagui'
import Button from '../Button'

interface Props {
  url?: string | null | undefined
  onPress?: () => void
}

export default function ShareButton({ url, onPress }: Props) {
  return (
    <Button variant="outlined" bg={'$white1'} theme={'gray'} size="xl" width="100%" justifyContent="space-between" onPress={onPress}>
      <XStack flexShrink={1}>
        <Text.MD secondary numberOfLines={1} flex={1}>
          {url !== null && url?.replace('https://', '')}
        </Text.MD>
      </XStack>
      <XStack justifyContent="flex-end">
        <Copy color="$textSecondary" size={16} />
      </XStack>
    </Button>
  )
}
