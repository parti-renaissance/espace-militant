import Layout from '@/components/AppStructure/Layout/Layout'
import FieldSurveyDetailsScreen from "@/features_next/field-surveys/pages/details"

export default function QuestionnairesDetailsPage() {
  return (
    <Layout.Container hideSideBar={true} hideTabBar={true}>
      <FieldSurveyDetailsScreen />
    </Layout.Container>
  )
}
