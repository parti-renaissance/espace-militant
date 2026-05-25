import { useCallback, useRef, useState } from 'react'
import { Keyboard, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native'
import { isWeb, useMedia, YStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import type { LayoutScrollViewRef } from '@/components/AppStructure/Layout/LayoutScrollView'

import useKeyboardHeight from '@/hooks/useKeyboardHeight'
import { useBotChat } from '@/services/bot/hook'

import ScrollToBottomButton from '../components/ScrollToBottomButton'
import InputDock from '../components/input/InputDock'
import MessageList from '../components/messages/MessageList'
import { useAutoScrollOnStream } from '../hooks/useAutoScrollOnStream'
import { useBotMessageActions } from '../hooks/useBotMessageActions'
import { useInitialScrollToBottom } from '../hooks/useInitialScrollToBottom'
import type { TamaguiInputRef } from '../utils/getDomFromTamaguiRef'

export default function BotPage() {
  const media = useMedia()
  const scrollViewRef = useRef<LayoutScrollViewRef>(null)
  const inputRef = useRef<TamaguiInputRef>(null)
  const keyboardHeight = useKeyboardHeight()
  const [isAtBottom, setIsAtBottom] = useState(true)

  const { messages, input, handleInputChange, handleSubmit: rawHandleSubmit, isLoading, streamedContent, error, retry, stop, submit } = useBotChat()
  const { handleCopy, handleEdit } = useBotMessageActions({ inputRef, setInput: handleInputChange })

  const scrollToBottom = useCallback((animated = true) => {
    requestAnimationFrame(() => scrollViewRef.current?.scrollToEnd({ animated }))
  }, [])

  const scrollToBottomNoAnim = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false })
  }, [])

  useInitialScrollToBottom(() => scrollToBottom(false), messages.length > 0)
  useAutoScrollOnStream({ isAtBottom, streamedContent, messagesCount: messages.length, scrollFn: scrollToBottomNoAnim })

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
    setIsAtBottom(contentSize.height - contentOffset.y - layoutMeasurement.height < 80)
  }, [])

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return
    if (!isWeb) Keyboard.dismiss()
    rawHandleSubmit()
    scrollToBottom(true)
  }, [input, isLoading, rawHandleSubmit, scrollToBottom])

  const handleRetry = useCallback(() => {
    retry()
    scrollToBottom(true)
  }, [retry, scrollToBottom])

  const handleSuggestionPress = useCallback(
    (question: string) => {
      if (isLoading) return
      if (!isWeb) Keyboard.dismiss()
      submit(question)
      scrollToBottom(true)
    },
    [isLoading, submit, scrollToBottom],
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
          contentPaddingBottom={isWeb ? 220 : 220 + keyboardHeight}
          contentHorizontalPadding={media.sm ? 16 : 0}
          onCopy={handleCopy}
          onEdit={handleEdit}
          onRetry={handleRetry}
          onScroll={handleScroll}
        />
        {!isAtBottom && <ScrollToBottomButton onPress={() => scrollToBottom(true)} keyboardHeight={keyboardHeight} />}
        <InputDock
          inputRef={inputRef}
          value={input}
          isLoading={isLoading}
          showSuggestions={showEmpty}
          keyboardHeight={keyboardHeight}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onStop={stop}
          onSuggestionPress={handleSuggestionPress}
        />
      </YStack>
    </Layout.Main>
  )
}
