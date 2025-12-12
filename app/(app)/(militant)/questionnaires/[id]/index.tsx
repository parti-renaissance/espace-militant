import React from 'react'
import Head from 'expo-router/head'
import Layout from '@/components/AppStructure/Layout/Layout'
import FieldSurveyDetailsScreen from "@/features_next/field-surveys/pages/details"
import * as metatags from '@/config/metatags'

export default function QuestionnairesDetailsPage() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Questionnaires de terrain')}</title>
      </Head>
      <Layout.Container hideSideBar={true} hideTabBar={true} safeHorizontalPadding={false}>
        <FieldSurveyDetailsScreen />
      </Layout.Container>
    </>
  )
}
