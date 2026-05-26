import { forwardRef } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { isWeb, Spinner, View } from 'tamagui'

import LayoutScrollView, { type LayoutScrollViewRef } from '@/components/AppStructure/Layout/LayoutScrollView'
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

export const MessageList = forwardRef<LayoutScrollViewRef, Props>(function MessageList(
  { messages, isLoading, streamedContent, error, showNewChat, contentPaddingBottom, onScroll },
  ref,
) {
  return (
    <LayoutScrollView
      ref={ref}
      style={{ flex: 1 }}
      contentContainerStyle={{
        gap: 10,
        paddingBottom: contentPaddingBottom,
        minHeight: '100%',
        ...(isWeb ? { flex: 1 } : {}),
      }}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {error && (
        <View padding="$medium" backgroundColor="$red3" borderRadius="$medium" marginHorizontal="$medium">
          <VoxMarkdown content={error.message} />
        </View>
      )}
      {messages.map((m) => (
        <View
          key={m.id}
          alignSelf={m.role === 'user' ? 'flex-end' : 'flex-start'}
          maxWidth={m.role === 'user' ? '80%' : '100%'}
          minWidth={0}
          overflow="hidden"
          bg={m.role === 'user' ? '$textOutline20' : undefined}
          p="$medium"
          borderTopLeftRadius="$medium"
          borderTopRightRadius="$xsmall"
          borderBottomLeftRadius="$medium"
          borderBottomRightRadius="$medium"
        >
          <VoxMarkdown content={m.content} />
        </View>
      ))}
      {isLoading && (
        <View alignSelf="flex-start" maxWidth="100%" minWidth={0} overflow="hidden" p="$medium" br="$medium">
          {streamedContent ? <VoxMarkdown content={streamedContent} isStreaming /> : <Spinner size="small" />}
        </View>
      )}
      {showNewChat && <NewChat />}
    </LayoutScrollView>
  )
})

export default MessageList
