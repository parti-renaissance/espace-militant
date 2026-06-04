import { XStack, YStack } from 'tamagui'
import { RotateCcw } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button/Button'

import type { ChatError } from '@/hooks/chat/types'

type Props = {
  error: ChatError
  isLoading: boolean
  onRetry: () => void
}

export function ErrorBubble({ error, isLoading, onRetry }: Props) {
  return (
    <YStack padding="$medium" backgroundColor="$red100" borderRadius="$medium" marginHorizontal="$medium" gap="$small">
      <Text.SM color="$red900" regular multiline>
        {error.message}
      </Text.SM>
      {error.retryable && (
        <XStack justifyContent="flex-end">
          <VoxButton theme="orange" variant="soft" iconLeft={RotateCcw} size="sm" shrink onPress={onRetry} disabled={isLoading}>
            Réessayer
          </VoxButton>
        </XStack>
      )}
    </YStack>
  )
}

export default ErrorBubble
