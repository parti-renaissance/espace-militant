import React from 'react'
import Head from 'expo-router/head'
import { useMedia } from 'tamagui'
import { ClipboardCheck } from '@tamagui/lucide-icons'

import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import FieldSurveysListPage from '@/features_next/field-surveys/pages/list'

import * as metatags from '@/config/metatags'

export default function QuestionnairesPage() {
  const media = useMedia()

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Questionnaires de terrain')}</title>
      </Head>
      <Header title={media.xxs ? 'Questionnaires' : 'Questionnaires de terrain'} icon={ClipboardCheck} navigation={{ showBackButton: false }} />
      <Layout.Container safeHorizontalPadding={false}>
        <FieldSurveysListPage />
      </Layout.Container>
    </>
  )
}
