import { useCallback, useRef } from 'react'
import { FlatList, Keyboard } from 'react-native'
import { isWeb, useMedia, YStack } from 'tamagui'
import { useQueryClient } from '@tanstack/react-query'

import Layout from '@/components/AppStructure/Layout/Layout'
import InputDock from '@/components/chat/input/InputDock'
import MessageList from '@/components/chat/messages/MessageList'

import { useChatDockMetrics } from '@/hooks/chat/useChatDockMetrics'
import { useChatMessageActions } from '@/hooks/chat/useChatMessageActions'
import { useChatScrollToMessage } from '@/hooks/chat/useChatScrollToMessage'
import { useInitialScroll } from '@/hooks/chat/useInitialScroll'
import type { ChatMessage } from '@/hooks/chat/types'
import type { TamaguiInputRef } from '@/hooks/chat/utils/getDomFromTamaguiRef'
import { useCustomChat } from '@/services/chatbot/hook'

import { ChatBotNavigation } from '../components/ChatBotNavigation'
import { NewChat } from '../components/NewChat'

type ChatbotPageProps = {
  activeDiscussionId: string | null
  onActiveDiscussionChange: (id: string | null) => void
}

export default function ChatbotPage({ activeDiscussionId, onActiveDiscussionChange }: ChatbotPageProps) {
  const media = useMedia()
  const queryClient = useQueryClient()
  const scrollViewRef = useRef<FlatList<ChatMessage>>(null)
  const inputRef = useRef<TamaguiInputRef>(null)
  const { keyboardOpen, dockBottomOffset, scrollButtonBottom, contentPaddingBottom, onDockLayout } = useChatDockMetrics()

  const onThreadCreated = useCallback(
    (threadId: string) => {
      onActiveDiscussionChange(threadId)
      queryClient.invalidateQueries({ queryKey: ['chatbot-threads'] })
    },
    [queryClient, onActiveDiscussionChange],
  )

  const { messages, input, handleInputChange, handleSubmit: rawHandleSubmit, isLoading, stop, streamedContent, error, retry } = useCustomChat({
    threadId: activeDiscussionId,
    onThreadCreated,
  })
  const { handleCopy, handleEdit } = useChatMessageActions({ inputRef, setInput: handleInputChange })

  const scrollToBottom = useCallback((animated = true) => {
    requestAnimationFrame(() => scrollViewRef.current?.scrollToEnd({ animated }))
  }, [])

  const { scrollToLastAssistant, armScrollToLastUser, scrollToInitial } = useChatScrollToMessage({
    ref: scrollViewRef,
    messages,
    isLoading,
    scrollToBottom,
    webDomIdPrefix: 'chat-msg-',
  })

  useInitialScroll(scrollToInitial, messages.length > 0)

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return
    if (!isWeb) {
      inputRef.current?.blur()
      Keyboard.dismiss()
    }
    armScrollToLastUser()
    rawHandleSubmit()
  }, [input, isLoading, rawHandleSubmit, armScrollToLastUser])

  const handleRetry = useCallback(() => {
    armScrollToLastUser()
    retry()
  }, [retry, armScrollToLastUser])

  const showNewChat = !error && !activeDiscussionId && messages.length === 0 && !isLoading

  return (
    <>
      <ChatBotNavigation activeDiscussionId={activeDiscussionId} onActiveDiscussionChange={onActiveDiscussionChange} />
      <Layout.Main maxWidth={600}>
        <YStack position="relative" flex={1} minHeight={isWeb ? 'calc(100dvh - 56px)' : '100%'} gap="$medium">
          <MessageList
            ref={scrollViewRef}
            messages={messages}
            isLoading={isLoading}
            streamedContent={streamedContent}
            error={error}
            showEmpty={showNewChat}
            emptyContent={<NewChat />}
            contentPaddingBottom={contentPaddingBottom}
            contentHorizontalPadding={media.sm ? 16 : 0}
            onCopy={handleCopy}
            onEdit={handleEdit}
            onRetry={handleRetry}
          />
          <InputDock
            inputRef={inputRef}
            value={input}
            isLoading={isLoading}
            keyboardOpen={keyboardOpen}
            bottomOffset={dockBottomOffset}
            placeholder="Posez votre question…"
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onStop={stop}
            onLayout={onDockLayout}
          />
        </YStack>
      </Layout.Main>
    </>
  )
}
