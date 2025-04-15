import { ComponentProps, useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Container from '@/components/layouts/Container'
import { isWeb, Media, useMedia, View, ViewProps, withStaticProperties, XStack, YStack, YStackProps } from 'tamagui'
import { ScrollContext } from './scrollContext'

export const padding = '$medium'
export const columnWidth = 333

const LayoutFrame = ({ children, webScrollable, ...props }: ComponentProps<typeof Container> & { webScrollable?: boolean; full?: boolean }) => {
  const insets = useSafeAreaInsets()
  const layoutRef = useRef<HTMLDivElement>(null)
  const media = useMedia()
  return (
    <Container
      ref={layoutRef}
      flex={1}
      bg="$textSurface"
      pl={insets.left}
      pr={insets.right}
      $gtMd={{ pl: insets.left ?? padding }}
      $gtLg={{ pl: insets.left }}
      overflowY={isWeb && webScrollable ? 'auto' : undefined}
      {...props}
    >
      <ScrollContext.Provider value={{ layoutRef, scrollActive: Boolean(isWeb && webScrollable && media.gtSm) }}>
        <XStack flex={1}>{children}</XStack>
      </ScrollContext.Provider>
    </Container>
  )
}

const LayoutSideBarLeft = ({ children, showOn = 'gtSm', ...props }: ViewProps & { showOn?: keyof Media }) => {
  const media = useMedia()
  return (
    media[showOn] && (
      <View $gtMd={{ width: columnWidth }} $md={{ width: 250 }} height="100%" pt={padding} $lg={{ pl: padding }} {...props}>
        {children}
      </View>
    )
  )
}

export const LayoutStateFrame = ({ children, ...props }: YStackProps) => {
  return (
    <YStack $sm={{ justifyContent: 'center' }} $gtSm={{ pt: 80 }} flex={1} {...props}>
      <YStack p="$medium" paddingTop="$medium" alignItems="center" gap="$medium">
        {children}
      </YStack>
    </YStack>
  )
}

const LayoutMainBarLeft = ({ children }: ViewProps) => {
  return (
    <View
      width="100%"
      $gtSm={{
        width: columnWidth,
        height: '100%',
        pt: padding,
        marginLeft: 'auto',
      }}
    >
      {children}
    </View>
  )
}

const LayoutSideBarRight = ({ children, alwaysShow, showOn = 'gtLg', ...props }: ViewProps & { showOn?: keyof Media; alwaysShow?: boolean }) => {
  const media = useMedia()
  return media[showOn] || alwaysShow ? (
    <View width={props.width ?? columnWidth} height="100%" pt={padding} {...props}>
      {children}
    </View>
  ) : null
}

const LayoutMainSingleColumn = ({ children, ...props }: YStackProps) => {
  return (
    <YStack flex={1} flexBasis={0} {...props}>
      {children}
    </YStack>
  )
}

export const LayoutPage = withStaticProperties(LayoutFrame, {
  SideBarLeft: LayoutSideBarLeft,
  SideBarRight: LayoutSideBarRight,
  MainSingleColumn: LayoutMainSingleColumn,
  MainSingleLeft: LayoutMainBarLeft,
  StateFrame: LayoutStateFrame,
})

export default LayoutPage
