import React from 'react'
import Head from 'expo-router/head'

import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import ChatbotPage from '@/features_next/chatbot/pages/index'

import * as metatags from '@/config/metatags'

function ChatbotScreen() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Chatbot')}</title>
      </Head>
      <Header title="Chatbot" />
      <Layout.Container hideTabBar>
        <ChatbotPage />
      </Layout.Container>
    </>
  )
}

export default ChatbotScreen
