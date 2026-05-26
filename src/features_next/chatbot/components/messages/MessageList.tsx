import { forwardRef, useCallback, useMemo } from 'react'
import { FlatList, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native'
import { isWeb, Spinner, View } from 'tamagui'

import VoxMarkdown from '@/components/VoxMarkdown/VoxMarkdown'

import type { ChatMessage } from '@/services/chatbot/hook'

import { NewChat } from '../NewChat'

type Props = {
  messages: ChatMessage[]
  isLoading: boolean
  streamedContent: string
  error: Error | null
  showNewChat: boolean
  contentPaddingBottom: number
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const keyExtractor = (item: ChatMessage) => item.id

export const MessageList = forwardRef<FlatList<ChatMessage>, Props>(function MessageList(
  { messages, isLoading, streamedContent, error, showNewChat, contentPaddingBottom, onScroll },
  ref,
) {
  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <View
        alignSelf={item.role === 'user' ? 'flex-end' : 'flex-start'}
        maxWidth={item.role === 'user' ? '80%' : '100%'}
        minWidth={0}
        overflow="hidden"
        bg={item.role === 'user' ? '$textOutline20' : undefined}
        p="$medium"
        borderTopLeftRadius="$medium"
        borderTopRightRadius="$xsmall"
        borderBottomLeftRadius="$medium"
        borderBottomRightRadius="$medium"
      >
        <VoxMarkdown content={item.content} />
      </View>
    ),
    [],
  )

  const ListHeader = useMemo(() => {
    if (!error) return null
    return (
      <View padding="$medium" backgroundColor="$red3" borderRadius="$medium" marginHorizontal="$medium">
        <VoxMarkdown content={error.message} />
      </View>
    )
  }, [error])

  const ListFooter = useMemo(
    () => (
      <>
        {isLoading && (
          <View alignSelf="flex-start" maxWidth="100%" minWidth={0} overflow="hidden" p="$medium" br="$medium">
            {streamedContent ? <VoxMarkdown content={streamedContent} isStreaming /> : <Spinner size="small" />}
          </View>
        )}
        {showNewChat && <NewChat />}
      </>
    ),
    [isLoading, streamedContent, showNewChat],
  )

  return (
    <FlatList<ChatMessage>
      ref={ref}
      style={{ flex: 1 }}
      contentContainerStyle={{
        gap: 10,
        paddingTop: 16,
        paddingBottom: contentPaddingBottom,
        flexGrow: 1,
        ...(isWeb ? { flex: 1 } : {}),
      }}
      data={messages}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      onScroll={onScroll}
      scrollEventThrottle={16}
      onScrollToIndexFailed={(info) => {
        const flatList = ref && 'current' in ref ? ref.current : null
        flatList?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true })
      }}
    />
  )
})

export default MessageList
