import React from 'react'

import Layout from '@/components/AppStructure/Layout/Layout'
import FieldSurveySuccessScreen from '@/features/field-surveys/pages/success'

export default function QuestionnairesSuccessPage() {
  return (
    <Layout.Container hideSideBar={true} hideTabBar={true} safeHorizontalPadding={false}>
      <FieldSurveySuccessScreen />
    </Layout.Container>
  )
}
