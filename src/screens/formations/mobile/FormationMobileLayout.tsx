import PageLayout from '@/components/layouts/PageLayout/PageLayout'

function FormationMobileLayout({ topVisual, children }: { topVisual: number; children: React.ReactNode }) {
  return (
    <PageLayout marginTop={-topVisual} bg="transparent" webScrollable>
      <PageLayout.MainSingleColumn>{children}</PageLayout.MainSingleColumn>
    </PageLayout>
  )
}

export default FormationMobileLayout
