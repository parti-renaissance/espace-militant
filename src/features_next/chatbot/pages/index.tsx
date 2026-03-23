import { ComponentRef, useCallback, useEffect, useRef } from 'react'
import { NativeSyntheticEvent, ScrollView } from 'react-native'
import { Input, isWeb, Spinner, useMedia, View, YStack } from 'tamagui'
import { ArrowUpRight } from '@tamagui/lucide-icons'
import { useQueryClient } from '@tanstack/react-query'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import { VoxButton } from '@/components/Button/Button'
import VoxMarkdown from '@/components/VoxMarkdown/VoxMarkdown'

import useKeyboardHeight from '@/hooks/useKeyboardHeight'
import { useCustomChat } from '@/services/chatbot/hook'

import { ChatBotNavigation } from '../components/ChatBotNavigation'
import { NewChat } from '../components/NewChat'

type TamaguiInputRef = ComponentRef<typeof Input> & {
  getNativeRef?: () => ComponentRef<typeof Input> | null
}

type ChatbotPageProps = {
  activeDiscussionId: string | null
  onActiveDiscussionChange: (id: string | null) => void
}

export default function ChatbotPage({ activeDiscussionId, onActiveDiscussionChange }: ChatbotPageProps) {
  const media = useMedia()
  const queryClient = useQueryClient()
  const scrollViewRef = useRef<ScrollView>(null)
  const inputRef = useRef<TamaguiInputRef>(null)
  const keyboardHeight = useKeyboardHeight()

  const onThreadCreated = useCallback(
    (threadId: string) => {
      onActiveDiscussionChange(threadId)
      queryClient.invalidateQueries({ queryKey: ['chatbot-threads'] })
    },
    [queryClient, onActiveDiscussionChange],
  )

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, streamedContent, error } = useCustomChat({
    threadId: activeDiscussionId,
    onThreadCreated,
  })
  const canStop = isLoading

  const scrollToBottom = () => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamedContent])

  useEffect(() => {
    if (!isWeb || !inputRef.current) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    }

    const element = inputRef.current
    const textarea = element?.getNativeRef?.() || element
    const nativeNode = (textarea as { _nativeNode?: HTMLElement })?._nativeNode
    const domElement = nativeNode || (textarea as unknown as HTMLElement | null)

    if (domElement && domElement instanceof HTMLElement) {
      domElement.addEventListener('keydown', handleKeyDown)
      return () => domElement.removeEventListener('keydown', handleKeyDown)
    }
  }, [isWeb, handleSubmit])

  const handleKeyPress = (e: NativeSyntheticEvent<{ key: string; shiftKey?: boolean }>) => {
    if (isWeb) {
      const key = e.nativeEvent.key
      const shiftKey = e.nativeEvent.shiftKey
      if (key === 'Enter' && !shiftKey) {
        e.preventDefault?.()
        handleSubmit()
        return false
      }
    }
  }

  return (
    <>
      <ChatBotNavigation activeDiscussionId={activeDiscussionId} onActiveDiscussionChange={onActiveDiscussionChange} />
      <Layout.Main>
        <YStack position="relative" flex={1} minHeight={isWeb && media.sm ? 'calc(100dvh - 56px)' : isWeb ? '100dvh' : '100%'} gap="$medium">
          <LayoutScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{
              gap: 10,
              paddingBottom: isWeb ? 160 : 160 + keyboardHeight,
              minHeight: '100%',
              ...(isWeb ? { flex: 1 } : {}),
            }}
            onContentSizeChange={scrollToBottom}
          >
            {error && (
              <View padding="$medium" backgroundColor="$red3" borderRadius="$medium" marginHorizontal="$medium">
                <VoxMarkdown content={error.message} />
              </View>
            )}
            {messages.map((m, i) => (
              <View
                key={i}
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
            {!error && !activeDiscussionId && messages.length === 0 && !isLoading ? <NewChat /> : null}
          </LayoutScrollView>
          <YStack
            position={isWeb ? 'fixed' : 'absolute'}
            bottom={isWeb ? 0 : keyboardHeight}
            width="100%"
            maxWidth={media.gtSm ? 520 : '100%'}
            alignSelf="center"
            zIndex={100}
            bg="$textSurface"
            pb={media.gtMd ? '$medium' : 0}
          >
            <YStack
              backgroundColor="$white1"
              borderColor="$textOutline"
              borderWidth={1}
              borderTopLeftRadius={24}
              borderTopRightRadius={24}
              borderBottomLeftRadius={media.gtMd ? 24 : 0}
              borderBottomRightRadius={media.gtMd ? 24 : 0}
              overflow="hidden"
            >
              <View paddingTop={8}>
                <Input
                  ref={inputRef}
                  multiline
                  value={input}
                  onChangeText={handleInputChange}
                  onKeyPress={!isWeb ? handleKeyPress : undefined}
                  onSubmitEditing={isWeb ? undefined : handleSubmit}
                  borderWidth={0}
                  focusStyle={{ outlineWidth: 0 }}
                  maxHeight={160}
                  textAlignVertical="top"
                  placeholder="Formulez votre demande"
                  editable
                />
              </View>
              <View flex={1} pb="$medium" pt={4} paddingHorizontal={16} flexDirection="row" gap="$small" justifyContent="flex-end">
                {canStop && (
                  <VoxButton theme="gray" onPress={stop} shrink>
                    Arrêter
                  </VoxButton>
                )}
                <VoxButton theme="blue" onPress={handleSubmit} iconLeft={ArrowUpRight} shrink loading={isLoading} disabled={!input.trim() || isLoading} />
              </View>
            </YStack>
          </YStack>
        </YStack>
      </Layout.Main>
    </>
  )
}
