import { useTranslation } from 'react-i18next'
import { Spinner, useMedia, View, XStack } from 'tamagui'

import Text from '@/components/base/Text'

import BotAvatar from './BotAvatar'
import BotMarkdown from './BotMarkdown'

type Props = {
  streamedContent: string
}

export function LoadingMessage({ streamedContent }: Props) {
  const { t } = useTranslation()
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
        {streamedContent ? (
          <BotMarkdown content={streamedContent} isStreaming />
        ) : (
          <XStack gap="$small" alignItems="center">
            <Spinner size="small" color="$blue9" />
            <Text.SM primary regular>
              {t('bot.typing')}
            </Text.SM>
          </XStack>
        )}
      </View>
    </View>
  )
}

export default LoadingMessage
