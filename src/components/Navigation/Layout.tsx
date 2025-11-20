import React from 'react'
import { ScrollView, View, XStack, styled, withStaticProperties, ViewProps } from 'tamagui'
import { SideBar, SideBarState } from '@/components/Navigation/SideBar'

const LayoutRoot = styled(View, {
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
    my: 8,
    mx: 16,
    gap: 8,
  },
  $xl: {
    my: 12,
    mx: 24,
    gap: 12,
  },
  my: 16,
  mx: 32,
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
  return (
    <LayoutRoot {...props}>
      <LayoutWrapper>
        {sidebarState && <SideBar state={sidebarState} /* TODO: pass nav config here */ />}
        {children}
      </LayoutWrapper>
      {/* TODO: Add navbar here */}
    </LayoutRoot>
  )
}

interface ScrollViewProps extends React.ComponentProps<typeof ScrollView> {
  children: React.ReactNode
}

const ScrollViewComponent = ({ children, ...props }: ScrollViewProps) => {
  return <LayoutScrollView {...props}>{children}</LayoutScrollView>
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

