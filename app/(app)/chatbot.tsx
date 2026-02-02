import React from 'react'
import Head from 'expo-router/head'
import * as metatags from '@/config/metatags'
import ChatbotPage from '@/features_next/chatbot/pages/index'
import Layout from '@/components/AppStructure/Layout/Layout'

function ChatbotScreen() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Chatbot')}</title>
      </Head>
      <Layout.Container hideTabBar>
        <ChatbotPage /> 
      </Layout.Container>
    </>
  )
}

export default ChatbotScreen