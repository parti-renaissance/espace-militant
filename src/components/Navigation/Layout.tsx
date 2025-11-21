import React from 'react'
import { ScrollView, View, XStack, styled, withStaticProperties, ViewProps, useMedia } from 'tamagui'
import { StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SideBar, SideBarState } from '@/components/Navigation/SideBar'
import ConfigurableTabBar from '@/components/Navigation/TabBar'


const LayoutRoot = styled(View, {
  height: '100dvh',
  flex: 1,
  backgroundColor: '$textSurface',
})

const LayoutWrapper = styled(XStack, {
  flex: 1,
})

const LayoutScrollView = styled(ScrollView, {
  flex: 1,
})

const LayoutContainer = styled(XStack, {
  $lg: {
    py: 8,
    px: 16,
    gap: 8,
  },
  $xl: {
    py: 12,
    px: 24,
    gap: 12,
  },
  py: 16,
  px: 32,
  gap: 16,
  justifyContent: 'center',
})

const LayoutMain = styled(View, {
  flex: 2,
  maxWidth: 520,
})

const LayoutSideBar = styled(View, {
  flex: 1,
  variants: {
    isSticky: {
      true: {
        position: 'sticky',
        $lg: {
          top: 8,
        },
        $xl: {
          top: 12,
        },
        top: 16,
      },
    },
  },
})

interface LayoutProps extends ViewProps {
  children: React.ReactNode
  sidebarState?: SideBarState
}

const Layout = ({ children, sidebarState, ...props }: LayoutProps) => {
  const media = useMedia()

  return (
    <LayoutRoot {...props}>
      <LayoutWrapper>
        {sidebarState && media.gtSm && <SideBar state={sidebarState} />}
        {children}
      </LayoutWrapper>
      {!media.gtSm && (
        <ConfigurableTabBar tabOrder={['accueil', 'evenements', 'cadreSheet', 'actions', 'more']} />
      )}
    </LayoutRoot>
  )
}

interface ScrollViewProps extends React.ComponentProps<typeof ScrollView> {
  children: React.ReactNode
  safeArea?: boolean
}

const ScrollViewComponent = ({ children, safeArea, contentContainerStyle, ...props }: ScrollViewProps) => {
  const insets = useSafeAreaInsets()
  return (
    <LayoutScrollView
      {...props}
      contentContainerStyle={
        StyleSheet.flatten([
          contentContainerStyle as StyleProp<ViewStyle>,
          safeArea && {
            paddingBottom: insets.bottom,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]) as ScrollViewProps['contentContainerStyle']
      }
    >
      {children}
    </LayoutScrollView>
  )
}

interface ContainerProps extends React.ComponentProps<typeof XStack> {
  children: React.ReactNode
}

const Container = ({ children, ...props }: ContainerProps) => {
  return <LayoutContainer {...props}>{children}</LayoutContainer>
}

interface MainProps extends ViewProps {
  children: React.ReactNode
  maxWidth?: number | string
}

const Main = ({ children, maxWidth = 520, ...props }: MainProps) => {
  return (
    <LayoutMain maxWidth={maxWidth} {...props}>
      {children}
    </LayoutMain>
  )
}

interface SideBarProps extends ViewProps {
  children: React.ReactNode
  isSticky?: boolean
  maxWidth?: number | string
}

const SideBarComponent = (props: SideBarProps) => {
  return (
    <LayoutSideBar isSticky={props.isSticky} maxWidth={props.maxWidth} {...props}>
      {props.children}
    </LayoutSideBar>
  )
}

export default withStaticProperties(Layout, {
  ScrollView: ScrollViewComponent,
  Container,
  Main,
  SideBar: SideBarComponent,
})
