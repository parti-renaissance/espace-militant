import { forwardRef, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { FlatList, useWindowDimensions, View } from 'react-native'
import { isWeb, YStack } from 'tamagui'

import type { ChatError, ChatMessage } from '@/hooks/chat/types'

import AssistantMessage from './AssistantMessage'
import ErrorBubble from './ErrorBubble'
import LoadingMessage from './LoadingMessage'
import UserMessage from './UserMessage'

type Props = {
  messages: ChatMessage[]
  isLoading: boolean
  streamedContent: string
  error: ChatError | null
  showEmpty?: boolean
  emptyContent?: ReactNode
  contentPaddingBottom: number
  contentHorizontalPadding?: number
  onCopy: (text: string) => void
  onEdit: (text: string) => void
  onRetry: () => void
}

export const MessageList = forwardRef<FlatList<ChatMessage>, Props>(function MessageList(
  { messages, isLoading, streamedContent, error, showEmpty, emptyContent, contentPaddingBottom, contentHorizontalPadding = 0, onCopy, onEdit, onRetry },
  ref,
) {
  const { height: windowHeight } = useWindowDimensions()
  const spacerHeight = Math.round(windowHeight * 0.3)
  const [openedMessageId, setOpenedMessageId] = useState<string | null>(null)

  const closeActions = useCallback(() => setOpenedMessageId(null), [])

  const handleToggleUserMessage = useCallback((id: string) => {
    setOpenedMessageId((prev) => (prev === id ? null : id))
  }, [])

  const handleScroll = useCallback(() => {
    if (openedMessageId !== null) setOpenedMessageId(null)
  }, [openedMessageId])

  useEffect(() => {
    if (!openedMessageId) return
    const timer = setTimeout(closeActions, 4000)
    return () => clearTimeout(timer)
  }, [openedMessageId, closeActions])

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) =>
      item.role === 'user' ? (
        <UserMessage
          messageId={item.id}
          content={item.content}
          isOpen={openedMessageId === item.id}
          onToggle={handleToggleUserMessage}
          onEdit={onEdit}
          onCopy={onCopy}
        />
      ) : (
        <AssistantMessage messageId={item.id} content={item.content} onCopy={onCopy} />
      ),
    [openedMessageId, handleToggleUserMessage, onEdit, onCopy],
  )

  const keyExtractor = useCallback((item: ChatMessage) => item.id, [])

  const ListFooter = useMemo(
    () => (
      <>
        {isLoading && <LoadingMessage streamedContent={streamedContent} />}
        {error && <ErrorBubble error={error} isLoading={isLoading} onRetry={onRetry} />}
        {messages.length > 0 && <View style={{ height: spacerHeight }} />}
      </>
    ),
    [isLoading, streamedContent, error, onRetry, messages.length, spacerHeight],
  )

  return (
    <YStack flex={1} onPress={openedMessageId ? closeActions : undefined}>
      <FlatList<ChatMessage>
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
          setTimeout(() => {
            flatList?.scrollToIndex({ index: info.index, viewPosition: 0, animated: true })
          }, 200)
        }}
      />
      {emptyContent && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={contentPaddingBottom}
          justifyContent="center"
          alignItems="center"
          pointerEvents="box-none"
          display={showEmpty ? 'flex' : 'none'}
        >
          {emptyContent}
        </YStack>
      )}
    </YStack>
  )
})

export default MessageList
