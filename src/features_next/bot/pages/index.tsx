import { useCallback, useEffect, useRef } from 'react';
import { FlatList, Keyboard } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { isWeb, useMedia, YStack } from 'tamagui';
import Layout from '@/components/AppStructure/Layout/Layout';
import InputDock from '@/components/chat/input/InputDock';
import JumpToBottomButton from '@/components/chat/JumpToBottomButton';
import MessageList from '@/components/chat/messages/MessageList';
import type { ChatMessage } from '@/hooks/chat/types';
import { useChatDockMetrics } from '@/hooks/chat/useChatDockMetrics';
import { useChatMessageActions } from '@/hooks/chat/useChatMessageActions';
import { useChatScrollToMessage } from '@/hooks/chat/useChatScrollToMessage';
import { useInitialScroll } from '@/hooks/chat/useInitialScroll';
import { useShowJumpToBottom } from '@/hooks/chat/useShowJumpToBottom';
import type { TamaguiInputRef } from '@/hooks/chat/utils/getDomFromTamaguiRef';
import { BOT_MESSAGE_MAX_LENGTH } from '@/services/bot/api';
import { useBotChat } from '@/services/bot/hook';
import EmptyState from '../components/EmptyState';
import SuggestionsList from '../components/input/SuggestionsList';


export default function BotPage() {
  const media = useMedia()
  const params = useLocalSearchParams<{ question?: string }>()
  const scrollViewRef = useRef<FlatList<ChatMessage>>(null)
  const inputRef = useRef<TamaguiInputRef>(null)
  const { keyboardOpen, dockBottomOffset, scrollButtonBottom, contentPaddingBottom, onDockLayout } = useChatDockMetrics()

  const { messages, input, handleInputChange, handleSubmit: rawHandleSubmit, isLoading, streamedContent, error, retry, stop, submit } = useBotChat()
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

  const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null
  const { show: showJumpToBottom, handleScroll: handleJumpScroll } = useShowJumpToBottom({ lastMessageId })

  const autoSubmittedRef = useRef(false)
  useEffect(() => {
    const initialQuestion = typeof params.question === 'string' ? params.question.trim() : ''
    if (!initialQuestion || autoSubmittedRef.current || isLoading) return
    autoSubmittedRef.current = true
    armScrollToLastUser()
    submit(initialQuestion)
  }, [params.question, submit, isLoading, armScrollToLastUser])

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
    <Layout.Main maxWidth={600}>
      <YStack position="relative" flex={1} minHeight={isWeb && media.sm ? 'calc(100dvh - 56px)' : isWeb ? '100dvh' : '100%'} gap="$medium">
        <MessageList
          ref={scrollViewRef}
          messages={messages}
          isLoading={isLoading}
          streamedContent={streamedContent}
          error={error}
          showEmpty={showEmpty}
          emptyContent={<EmptyState />}
          contentPaddingBottom={contentPaddingBottom}
          contentHorizontalPadding={media.sm ? 16 : 0}
          onCopy={handleCopy}
          onEdit={handleEdit}
          onRetry={handleRetry}
          onScroll={handleJumpScroll}
        />
        {showJumpToBottom && <JumpToBottomButton onPress={scrollToLastAssistant} bottom={scrollButtonBottom} />}
        <InputDock
          inputRef={inputRef}
          value={input}
          isLoading={isLoading}
          keyboardOpen={keyboardOpen}
          bottomOffset={dockBottomOffset}
          placeholder="Formulez votre demande…"
          maxLength={BOT_MESSAGE_MAX_LENGTH}
          topSlot={showEmpty ? <SuggestionsList onPress={handleSuggestionPress} /> : undefined}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onStop={stop}
          onLayout={onDockLayout}
        />
      </YStack>
    </Layout.Main>
  )
}
