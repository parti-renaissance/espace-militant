import React, { useMemo } from 'react'
import Layout from '@/components/Navigation/Layout'
import FieldSurveysListPage from '@/features_next/field-surveys/pages/list'

export default function QuestionnairesPage() {
  return (
    <Layout.Container>
      <FieldSurveysListPage />
    </Layout.Container>
  )
}