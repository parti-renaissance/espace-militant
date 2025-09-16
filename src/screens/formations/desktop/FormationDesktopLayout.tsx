import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import StickyBox from '@/components/StickyBox/StickyBox'
import { useMedia, View } from 'tamagui'

function FormationDesktopLayout({ topVisual, leftComponent, children }: { topVisual: number; children: React.ReactNode; leftComponent?: React.ReactNode }) {
  const media = useMedia()
  return (
    <PageLayout marginTop={-topVisual} bg="transparent" webScrollable>
      {leftComponent ? (
        <PageLayout.SideBarLeft
          showOn="gtSm"
          width={media.md ? 200 : undefined}
          pl={media.md ? '$medium' : undefined}
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
