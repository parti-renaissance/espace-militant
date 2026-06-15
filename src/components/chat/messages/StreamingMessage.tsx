import { memo } from 'react'
import { Spinner, useMedia, View, XStack } from 'tamagui'

import Text from '@/components/base/Text'
import VoxMarkdown from '@/components/VoxMarkdown/VoxMarkdown'

import BotAvatar from './BotAvatar'

type Props = {
  content: string
}

function StreamingMessageComponent({ content }: Props) {
  const media = useMedia()

  return (
    <View
      alignSelf="flex-start"
      maxWidth="100%"
      gap="$small"
      alignItems="flex-start"
      flexDirection={media.sm ? 'column' : 'row'}
      width={media.sm ? '100%' : undefined}
    >
      <BotAvatar />
      <View flex={media.sm ? undefined : 1} width={media.sm ? '100%' : undefined} minWidth={0} overflow="hidden" p="$medium" br="$medium">
        {content ? (
          <VoxMarkdown content={content} isStreaming />
        ) : (
          <XStack gap="$small" alignItems="center">
            <Spinner size="small" color="$blue9" />
            <Text.SM primary regular>
              Analyse en cours…
            </Text.SM>
          </XStack>
        )}
      </View>
    </View>
  )
}

export const StreamingMessage = memo(StreamingMessageComponent)
export default StreamingMessage
