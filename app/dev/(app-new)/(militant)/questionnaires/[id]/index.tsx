import FieldSurveyDetailsScreen from "@/features_next/field-surveys/pages/details";
import Layout from '@/components/Navigation/Layout'
export default function QuestionnairesDetailsPage() {
  return (
    <Layout.Container hideSideBar={true} hideTabBar={true}>
      <FieldSurveyDetailsScreen />
    </Layout.Container>
  )
}
