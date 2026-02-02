import React from 'react'
import Head from 'expo-router/head'
import * as metatags from '@/config/metatags'
import ChatbotPage from '@/features_next/chatbot/pages/index'
import Layout from '@/components/AppStructure/Layout/Layout'
import { Header } from '@/components/AppStructure'

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