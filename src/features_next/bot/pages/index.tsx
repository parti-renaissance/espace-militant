import { useCallback, useEffect, useRef } from 'react'
import { FlatList, Keyboard } from 'react-native'
import { isWeb, useMedia, YStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import JumpToBottomButton from '../../../components/chat/JumpToBottomButton'

import { useAutoScrollOnStream } from '@/hooks/chat/useAutoScrollOnStream'
import { useChatDockMetrics } from '@/hooks/chat/useChatDockMetrics'
import { useChatScrollPosition } from '@/hooks/chat/useChatScrollPosition'
import { useChatScrollToMessage } from '@/hooks/chat/useChatScrollToMessage'
import { useBotChat } from '@/services/bot/hook'
import type { BotChatMessage } from '@/services/bot/schema'

import InputDock from '../components/input/InputDock'
import MessageList from '../components/messages/MessageList'
import { useBotMessageActions } from '../hooks/useBotMessageActions'
import { useInitialScroll } from '../hooks/useInitialScroll'
import type { TamaguiInputRef } from '../utils/getDomFromTamaguiRef'

export default function BotPage() {
  const media = useMedia()
  const scrollViewRef = useRef<FlatList<BotChatMessage>>(null)
  const inputRef = useRef<TamaguiInputRef>(null)
  const { keyboardOpen, dockBottomOffset, scrollButtonBottom, contentPaddingBottom, onDockLayout } = useChatDockMetrics()
  const { isAtBottom, handleScroll } = useChatScrollPosition()

  const { messages, input, handleInputChange, handleSubmit: rawHandleSubmit, isLoading, streamedContent, error, retry, stop, submit } = useBotChat()
  const { handleCopy, handleEdit } = useBotMessageActions({ inputRef, setInput: handleInputChange })

  const scrollToBottom = useCallback((animated = true) => {
    requestAnimationFrame(() => scrollViewRef.current?.scrollToEnd({ animated }))
  }, [])

  const scrollToBottomNoAnim = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false })
  }, [])

  const { scrollToLastAssistant, armScrollToLastUser, scrollToInitial } = useChatScrollToMessage({
    ref: scrollViewRef,
    messages,
    isLoading,
    scrollToBottom,
  })

  useInitialScroll(scrollToInitial, messages.length > 0)
  useAutoScrollOnStream({ isAtBottom, streamedContent, messagesCount: messages.length, scrollFn: scrollToBottomNoAnim })

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [])

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

  const handleSuggestionPress = useCallback(
    (question: string) => {
      if (isLoading) return
      if (!isWeb) {
        inputRef.current?.blur()
        Keyboard.dismiss()
      }
      armScrollToLastUser()
      submit(question)
    },
    [isLoading, submit, armScrollToLastUser],
  )

  const showEmpty = !error && messages.length === 0 && !isLoading && !streamedContent

  return (
    <Layout.Main>
      <YStack position="relative" flex={1} minHeight={isWeb && media.sm ? 'calc(100dvh - 56px)' : isWeb ? '100dvh' : '100%'} gap="$medium">
        <MessageList
          ref={scrollViewRef}
          messages={messages}
          isLoading={isLoading}
          streamedContent={streamedContent}
          error={error}
          showEmpty={showEmpty}
          contentPaddingBottom={contentPaddingBottom}
          contentHorizontalPadding={media.sm ? 16 : 0}
          onCopy={handleCopy}
          onEdit={handleEdit}
          onRetry={handleRetry}
          onScroll={handleScroll}
        />
        {!isAtBottom && <JumpToBottomButton onPress={scrollToLastAssistant} bottom={scrollButtonBottom} />}
        <InputDock
          inputRef={inputRef}
          value={input}
          isLoading={isLoading}
          showSuggestions={showEmpty}
          keyboardOpen={keyboardOpen}
          bottomOffset={dockBottomOffset}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onStop={stop}
          onSuggestionPress={handleSuggestionPress}
          onLayout={onDockLayout}
        />
      </YStack>
    </Layout.Main>
  )
}
