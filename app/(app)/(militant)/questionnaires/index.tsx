import React from 'react'
import Layout from '@/components/AppStructure/Layout/Layout'
import FieldSurveysListPage from '@/features_next/field-surveys/pages/list'

export default function QuestionnairesPage() {
  return (
    <Layout.Container safeHorizontalPadding={false}>
      <FieldSurveysListPage />
    </Layout.Container>
  )
}