import React from 'react'
import { useMedia } from 'tamagui'
import { ClipboardCheck } from '@tamagui/lucide-icons'
import Layout from '@/components/AppStructure/Layout/Layout'
import FieldSurveysListPage from '@/features_next/field-surveys/pages/list'
import { Header } from '@/components/AppStructure'

export default function QuestionnairesPage() {
  const media = useMedia()

  return (
    <>
      <Header title={media.xxs ? "Questionnaires" : "Questionnaires de terrain"} icon={ClipboardCheck} navigation={{ showBackButton: false }} />
      <Layout.Container safeHorizontalPadding={false}>
        <FieldSurveysListPage />
      </Layout.Container>
    </>
  )
}