import { memo } from 'react'
import { useMedia, View, XStack, YStack } from 'tamagui'
import { Copy } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button/Button'

import BotAvatar from './BotAvatar'
import BotMarkdown from './BotMarkdown'

type Props = {
  content: string
  isAreaHovered: boolean
  onCopy: (text: string) => void
}

function AssistantMessageComponent({ content, isAreaHovered, onCopy }: Props) {
  const media = useMedia()

  return (
    <View
      alignSelf="flex-start"
      maxWidth="100%"
      gap="$small"
      alignItems="flex-start"
      flexDirection={media.sm ? 'column' : 'row'}
    >
      <BotAvatar />
      <YStack flex={media.sm ? undefined : 1} gap="$xsmall" minWidth={0} width={media.sm ? '100%' : undefined}>
        <View
          minWidth={0}
          overflow="hidden"
          bg={isAreaHovered ? '$textOutline10' : 'transparent'}
          p="$medium"
          borderTopLeftRadius="$xsmall"
          borderTopRightRadius="$medium"
          borderBottomLeftRadius="$medium"
          borderBottomRightRadius="$medium"
          animation="quick"
        >
          <BotMarkdown content={content} />
        </View>
        <XStack justifyContent="flex-start">
          <VoxButton iconLeft={Copy} variant="text" theme="gray" size="sm" shrink onPress={() => onCopy(content)} />
        </XStack>
      </YStack>
    </View>
  )
}

export const AssistantMessage = memo(AssistantMessageComponent)
export default AssistantMessage
