import { forwardRef, useState } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { isWeb, YStack } from 'tamagui'

import LayoutScrollView, { type LayoutScrollViewRef } from '@/components/AppStructure/Layout/LayoutScrollView'

import type { BotChatError, BotChatMessage } from '@/services/bot/schema'

import EmptyState from '../EmptyState'
import AssistantMessage from './AssistantMessage'
import ErrorBubble from './ErrorBubble'
import LoadingMessage from './LoadingMessage'
import UserMessage from './UserMessage'

type Props = {
  messages: BotChatMessage[]
  isLoading: boolean
  streamedContent: string
  error: BotChatError | null
  showEmpty: boolean
  contentPaddingBottom: number
  contentHorizontalPadding: number
  onCopy: (text: string) => void
  onEdit: (text: string) => void
  onRetry: () => void
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
}

export const MessageList = forwardRef<LayoutScrollViewRef, Props>(function MessageList(
  { messages, isLoading, streamedContent, error, showEmpty, contentPaddingBottom, contentHorizontalPadding, onCopy, onEdit, onRetry, onScroll },
  ref,
) {
  const [isAreaHovered, setIsAreaHovered] = useState(false)

  return (
    <YStack flex={1} onHoverIn={() => setIsAreaHovered(true)} onHoverOut={() => setIsAreaHovered(false)}>
      <LayoutScrollView
        ref={ref}
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: 10,
          paddingBottom: contentPaddingBottom,
          paddingHorizontal: contentHorizontalPadding,
          minHeight: '100%',
          ...(isWeb ? { flex: 1 } : {}),
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {messages.map((m) =>
          m.role === 'user' ? (
            <UserMessage key={m.id} content={m.content} isAreaHovered={isAreaHovered} onEdit={onEdit} onCopy={onCopy} />
          ) : (
            <AssistantMessage key={m.id} content={m.content} isAreaHovered={isAreaHovered} onCopy={onCopy} />
          ),
        )}
        {isLoading && <LoadingMessage streamedContent={streamedContent} />}
        {error && <ErrorBubble error={error} isLoading={isLoading} onRetry={onRetry} />}
        {showEmpty && <EmptyState />}
      </LayoutScrollView>
    </YStack>
  )
})

export default MessageList
