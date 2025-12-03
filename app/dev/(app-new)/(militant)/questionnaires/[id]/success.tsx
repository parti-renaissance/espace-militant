import React, { useMemo } from 'react'
import Layout from '@/components/Navigation/Layout'
import FieldSurveySuccessScreen from '@/features_next/field-surveys/pages/success'

export default function QuestionnairesSuccessPage() {
  return (
    <Layout.Container hideTabBar={true}>
      <FieldSurveySuccessScreen />
    </Layout.Container>
  )
}