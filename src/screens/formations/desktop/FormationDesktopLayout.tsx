import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import StickyBox from '@/components/StickyBox/StickyBox'
import { View } from 'tamagui'

function FormationDesktopLayout({ topVisual, leftComponent, children }: { topVisual: number; children: React.ReactNode; leftComponent?: React.ReactNode }) {
  return (
    <PageLayout marginTop={-topVisual} bg="transparent" webScrollable>
      {leftComponent ? (
        <PageLayout.SideBarLeft
          showOn="gtSm"
          $md={{
            width: 200,
            pl: '$medium',
          }}
        >
          <StickyBox offsetTop="$medium" offsetBottom="$xxxlarge">
            <View marginTop={topVisual}>{leftComponent}</View>
          </StickyBox>
        </PageLayout.SideBarLeft>
      ) : null}
      <PageLayout.MainSingleColumn>{children}</PageLayout.MainSingleColumn>
    </PageLayout>
  )
}

export default FormationDesktopLayout
