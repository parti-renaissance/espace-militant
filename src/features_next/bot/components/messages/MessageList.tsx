import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native'
import { isWeb, YStack } from 'tamagui'

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

export const MessageList = forwardRef<FlatList<BotChatMessage>, Props>(function MessageList(
  { messages, isLoading, streamedContent, error, showEmpty, contentPaddingBottom, contentHorizontalPadding, onCopy, onEdit, onRetry, onScroll },
  ref,
) {
  const [isAreaHovered, setIsAreaHovered] = useState(false)
  const [openedMessageId, setOpenedMessageId] = useState<string | null>(null)

  const closeActions = useCallback(() => setOpenedMessageId(null), [])

  const handleToggleUserMessage = useCallback((id: string) => {
    setOpenedMessageId((prev) => (prev === id ? null : id))
  }, [])

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScroll(e)
      if (openedMessageId !== null) setOpenedMessageId(null)
    },
    [onScroll, openedMessageId],
  )

  useEffect(() => {
    if (!openedMessageId) return
    const timer = setTimeout(closeActions, 4000)
    return () => clearTimeout(timer)
  }, [openedMessageId, closeActions])

  const renderItem = useCallback(
    ({ item }: { item: BotChatMessage }) =>
      item.role === 'user' ? (
        <UserMessage
          messageId={item.id}
          content={item.content}
          isAreaHovered={isAreaHovered}
          isOpen={openedMessageId === item.id}
          onToggle={handleToggleUserMessage}
          onEdit={onEdit}
          onCopy={onCopy}
        />
      ) : (
        <AssistantMessage content={item.content} isAreaHovered={isAreaHovered} onCopy={onCopy} />
      ),
    [isAreaHovered, openedMessageId, handleToggleUserMessage, onEdit, onCopy],
  )

  const keyExtractor = useCallback((item: BotChatMessage) => item.id, [])

  const ListFooter = useMemo(
    () => (
      <>
        {isLoading && <LoadingMessage streamedContent={streamedContent} />}
        {error && <ErrorBubble error={error} isLoading={isLoading} onRetry={onRetry} />}
        {showEmpty && <EmptyState />}
      </>
    ),
    [isLoading, streamedContent, error, onRetry, showEmpty],
  )

  return (
    <YStack
      flex={1}
      onHoverIn={() => setIsAreaHovered(true)}
      onHoverOut={() => setIsAreaHovered(false)}
      onPress={openedMessageId ? closeActions : undefined}
    >
      <FlatList<BotChatMessage>
        ref={ref}
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: 10,
          paddingTop: 16,
          paddingBottom: contentPaddingBottom,
          paddingHorizontal: contentHorizontalPadding,
          flexGrow: 1,
          ...(isWeb ? { flex: 1 } : {}),
        }}
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={ListFooter}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollToIndexFailed={(info) => {
          const flatList = ref && 'current' in ref ? ref.current : null
          flatList?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true })
        }}
      />
    </YStack>
  )
})

export default MessageList
