import React, { useRef, useState } from 'react'
import Head from 'expo-router/head'

import { Menu } from '@tamagui/lucide-icons'
import { useMedia, YStack } from 'tamagui'

import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import { VoxButton } from '@/components/Button'

import ChatbotPage from '@/features_next/chatbot/pages/index'
import ChatBotSheet, { type ChatBotSheetRef } from '@/features_next/chatbot/components/ChatBotSheet'

import { useGetPaginatedChatbotThreads } from '@/services/chatbot/hook'

import * as metatags from '@/config/metatags'

function ChatbotScreen() {
  const media = useMedia()
  const sheetRef = useRef<ChatBotSheetRef>(null)
  const [activeDiscussionId, setActiveDiscussionId] = useState<string | null>(null)
  const { data } = useGetPaginatedChatbotThreads()

  const threads = data?.pages.flatMap((p) => p.items) ?? []
  const activeThreadTitle = activeDiscussionId ? threads.find((t) => t.uuid === activeDiscussionId)?.title : null

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Chatbot')}</title>
      </Head>
      <Header
        title={activeThreadTitle ?? 'Nouvelle conversation'}
        rightComponent={
          media.sm ? (
            <YStack height="100%" justifyContent="flex-start" alignItems="flex-end" paddingTop={8} paddingRight={8}>
              <VoxButton iconLeft={Menu} size="lg" shrink variant="soft" onPress={() => sheetRef.current?.expand()} />
            </YStack>
          ) : null
        }
      />
      <Layout.Container hideTabBar>
        <ChatbotPage activeDiscussionId={activeDiscussionId} onActiveDiscussionChange={setActiveDiscussionId} />
      </Layout.Container>
      {media.sm && <ChatBotSheet ref={sheetRef} activeDiscussionId={activeDiscussionId} onActiveDiscussionChange={setActiveDiscussionId} />}
    </>
  )
}

export default ChatbotScreen
