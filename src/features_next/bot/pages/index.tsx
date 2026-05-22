import { useCallback, useRef, useState } from 'react'
import { Keyboard, type NativeScrollEvent, type NativeSyntheticEvent, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { isWeb, useMedia, YStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView, { type LayoutScrollViewRef } from '@/components/AppStructure/Layout/LayoutScrollView'

import useKeyboardHeight from '@/hooks/useKeyboardHeight'
import { useBotChat } from '@/services/bot/hook'

import AssistantMessage from '../components/AssistantMessage'
import BotDisclaimer from '../components/BotDisclaimer'
import ChatInput from '../components/ChatInput'
import EmptyState from '../components/EmptyState'
import ErrorBubble from '../components/ErrorBubble'
import LoadingMessage from '../components/LoadingMessage'
import ScrollToBottomButton from '../components/ScrollToBottomButton'
import SuggestionsList from '../components/SuggestionsList'
import UserMessage from '../components/UserMessage'
import { useBotMessageActions } from '../hooks/useBotMessageActions'
import { useInitialScrollToBottom } from '../hooks/useInitialScrollToBottom'
import type { TamaguiInputRef } from '../utils/getDomFromTamaguiRef'

export default function BotPage() {
  const media = useMedia()
  const scrollViewRef = useRef<LayoutScrollViewRef>(null)
  const inputRef = useRef<TamaguiInputRef>(null)
  const keyboardHeight = useKeyboardHeight()
  const insets = useSafeAreaInsets()
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isAreaHovered, setIsAreaHovered] = useState(false)

  const { messages, input, handleInputChange, handleSubmit: rawHandleSubmit, isLoading, streamedContent, error, retry, stop, submit } = useBotChat()
  const { handleCopy, handleEdit } = useBotMessageActions({ inputRef, setInput: handleInputChange })

  const scrollToBottom = useCallback((animated = true) => {
    requestAnimationFrame(() => scrollViewRef.current?.scrollToEnd({ animated }))
  }, [])

  useInitialScrollToBottom(() => scrollToBottom(false), messages.length > 0)

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
        <YStack flex={1} onHoverIn={() => setIsAreaHovered(true)} onHoverOut={() => setIsAreaHovered(false)}>
          <LayoutScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{
              gap: 10,
              paddingBottom: isWeb ? 220 : 220 + keyboardHeight,
              paddingHorizontal: media.sm ? 16 : 0,
              minHeight: '100%',
              ...(isWeb ? { flex: 1 } : {}),
            }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {messages.map((m) =>
              m.role === 'user' ? (
                <UserMessage key={m.id} content={m.content} isAreaHovered={isAreaHovered} onEdit={handleEdit} onCopy={handleCopy} />
              ) : (
                <AssistantMessage key={m.id} content={m.content} isAreaHovered={isAreaHovered} onCopy={handleCopy} />
              ),
            )}
            {isLoading && <LoadingMessage streamedContent={streamedContent} />}
            {error && <ErrorBubble error={error} isLoading={isLoading} onRetry={handleRetry} />}
            {showEmpty && <EmptyState />}
          </LayoutScrollView>
        </YStack>

        {!isAtBottom && <ScrollToBottomButton onPress={() => scrollToBottom(true)} keyboardHeight={keyboardHeight} />}

        <YStack
          position={isWeb ? 'fixed' : 'absolute'}
          bottom={isWeb ? 0 : keyboardHeight + (Platform.OS === 'ios' ? insets.bottom : 16)}
          width="100%"
          maxWidth={media.gtSm ? 520 : '100%'}
          alignSelf="center"
          zIndex={100}
          bg="$textSurface"
          pb={media.gtMd ? '$medium' : 0}
          paddingHorizontal={media.sm ? 16 : 0}
          gap="$small"
        >
          {showEmpty && <SuggestionsList onPress={handleSuggestionPress} />}
          <ChatInput inputRef={inputRef} value={input} isLoading={isLoading} onChange={handleInputChange} onSubmit={handleSubmit} onStop={stop} />
          <BotDisclaimer />
        </YStack>
      </YStack>
    </Layout.Main>
  )
}
