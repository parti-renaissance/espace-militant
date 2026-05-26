import { useCallback, useEffect, useRef } from 'react'
import { Keyboard } from 'react-native'
import { isWeb, useMedia, YStack } from 'tamagui'
import { useQueryClient } from '@tanstack/react-query'

import Layout from '@/components/AppStructure/Layout/Layout'
import type { LayoutScrollViewRef } from '@/components/AppStructure/Layout/LayoutScrollView'
import ScrollToBottomButton from '@/components/chat/ScrollToBottomButton'

import { useAutoScrollOnStream } from '@/hooks/chat/useAutoScrollOnStream'
import { useChatDockMetrics } from '@/hooks/chat/useChatDockMetrics'
import { useChatScrollPosition } from '@/hooks/chat/useChatScrollPosition'
import { useCustomChat } from '@/services/chatbot/hook'

import { ChatBotNavigation } from '../components/ChatBotNavigation'
import InputDock, { type TamaguiInputRef } from '../components/input/InputDock'
import MessageList from '../components/messages/MessageList'

type ChatbotPageProps = {
  activeDiscussionId: string | null
  onActiveDiscussionChange: (id: string | null) => void
}

export default function ChatbotPage({ activeDiscussionId, onActiveDiscussionChange }: ChatbotPageProps) {
  const media = useMedia()
  const queryClient = useQueryClient()
  const scrollViewRef = useRef<LayoutScrollViewRef>(null)
  const inputRef = useRef<TamaguiInputRef>(null)
  const { dockBottomOffset, scrollButtonBottom, contentPaddingBottom, onDockLayout } = useChatDockMetrics()
  const { isAtBottom, handleScroll } = useChatScrollPosition()

  const onThreadCreated = useCallback(
    (threadId: string) => {
      onActiveDiscussionChange(threadId)
      queryClient.invalidateQueries({ queryKey: ['chatbot-threads'] })
    },
    [queryClient, onActiveDiscussionChange],
  )

  const { messages, input, handleInputChange, handleSubmit: rawHandleSubmit, isLoading, stop, streamedContent, error } = useCustomChat({
    threadId: activeDiscussionId,
    onThreadCreated,
  })

  const scrollToBottom = useCallback((animated = true) => {
    requestAnimationFrame(() => scrollViewRef.current?.scrollToEnd({ animated }))
  }, [])

  const scrollToBottomNoAnim = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false })
  }, [])

  useAutoScrollOnStream({ isAtBottom, streamedContent, messagesCount: messages.length, scrollFn: scrollToBottomNoAnim })

  const prevScrolledThreadRef = useRef<string | null | undefined>(undefined)
  useEffect(() => {
    if (messages.length === 0) return
    if (prevScrolledThreadRef.current !== activeDiscussionId) {
      prevScrolledThreadRef.current = activeDiscussionId
      scrollToBottom(false)
    }
  }, [activeDiscussionId, messages.length, scrollToBottom])

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return
    if (!isWeb) {
      inputRef.current?.blur()
      Keyboard.dismiss()
    }
    rawHandleSubmit()
    scrollToBottom(true)
  }, [input, isLoading, rawHandleSubmit, scrollToBottom])

  const showNewChat = !error && !activeDiscussionId && messages.length === 0 && !isLoading

  return (
    <>
      <ChatBotNavigation activeDiscussionId={activeDiscussionId} onActiveDiscussionChange={onActiveDiscussionChange} />
      <Layout.Main>
        <YStack position="relative" flex={1} minHeight={isWeb && media.sm ? 'calc(100dvh - 56px)' : isWeb ? '100dvh' : '100%'} gap="$medium">
          <MessageList
            ref={scrollViewRef}
            messages={messages}
            isLoading={isLoading}
            streamedContent={streamedContent}
            error={error}
            showNewChat={showNewChat}
            contentPaddingBottom={contentPaddingBottom}
            onScroll={handleScroll}
          />
          {!isAtBottom && <ScrollToBottomButton onPress={() => scrollToBottom(true)} bottom={scrollButtonBottom} />}
          <InputDock
            inputRef={inputRef}
            value={input}
            isLoading={isLoading}
            bottomOffset={dockBottomOffset}
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
