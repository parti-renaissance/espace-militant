import React, { useRef, useEffect } from 'react'
import { ScrollView, View, XStack, styled, withStaticProperties, ViewProps, useMedia, isWeb } from 'tamagui'
import { StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SideBar, SideBarState } from '@/components/Navigation/SideBar'
import ConfigurableTabBar from '@/components/Navigation/TabBar'
import { YStack } from 'tamagui'
import { ScrollContext } from './scrollContext'
import useLayoutSpacing, { UseLayoutSpacingOptions } from './hook/useLayoutSpacing'
import { useCadreNavItems } from '@/config/navigationItems'
import { useLayoutContext } from './LayoutContext'

const SAFE_AREA_PADDING = 16

const LayoutRoot = styled(View, {
  height: '100dvh',
  flex: 1,
  backgroundColor: '$textSurface',
})

const LayoutWrapper = styled(XStack, {
  flex: 1,
})

const LayoutSideBar = styled(View, {
  flex: 1,
  $sm: {
    display: 'none',
  },
  variants: {
    isSticky: {
      true: {
        position: 'sticky',
        top: 0,
      },
    },
  },
} as const)

interface LayoutProps extends ViewProps {
  children: React.ReactNode
  sidebarState?: SideBarState
  hideTabBar?: boolean
}

const Layout = ({ children, sidebarState, hideTabBar, ...props }: LayoutProps) => {
  const media = useMedia()
  const cadreNavItems = useCadreNavItems()

  return (
    <LayoutRoot {...props}>
      <LayoutWrapper>
        {sidebarState && media.gtSm && <SideBar state={sidebarState} navCadreItems={cadreNavItems} />}
        {children}
      </LayoutWrapper>
      {!media.gtSm && <ConfigurableTabBar hide={hideTabBar} navCadreItems={cadreNavItems} />}
    </LayoutRoot>
  )
}

const ContentContainer = styled(XStack, {
  flex: 1,
  justifyContent: "center",
  alignItems: "flex-start",
  $lg: {
    gap: 16,
  },
  $xl: {
    gap: 24,
  },
  gap: 32,
})

interface ContainerProps extends ViewProps {
  children: React.ReactNode
  hideSideBar?: boolean
  hideTabBar?: boolean
  sidebarState?: SideBarState
}

const Container = ({ children, hideSideBar, hideTabBar, sidebarState, ...props }: ContainerProps) => {
  const insets = useSafeAreaInsets()
  const layoutRef = useRef<HTMLDivElement>(null)
  const media = useMedia()
  const { setHideSideBar, setHideTabBar, setSidebarState } = useLayoutContext()
  
  useEffect(() => {
    setSidebarState(sidebarState ?? 'militant');
    setHideSideBar(hideSideBar ?? false);
    setHideTabBar(hideTabBar ?? false);
  
    return () => {
      setHideSideBar(false);
      setHideTabBar(false);
    };
  }, [hideSideBar, hideTabBar, setHideSideBar, setHideTabBar, sidebarState]);

  return (
    <YStack alignItems="center"
      ref={layoutRef}
      flex={1}
      bg="$textSurface"
      pl={media.gtLg ? insets.left : (media.gtMd ? (insets.left) : insets.left)}
      pr={insets.right}
      overflowY={isWeb ? 'auto' : undefined}
      {...props}
    >
      <YStack width="100%" flexGrow={1}>
        <ScrollContext.Provider value={{ layoutRef: layoutRef as React.RefObject<HTMLDivElement>, scrollActive: Boolean(isWeb && media.gtSm) }}>
          <ContentContainer>
            {children}
          </ContentContainer>
        </ScrollContext.Provider>
      </YStack>
    </YStack>
  )
}

const MainContainer = styled(View, {
  flex: 2,
  maxWidth: 520,
  $sm: {
    maxWidth: '100%',
  },
})

const Main = ({ children, maxWidth = 520 }: { children: React.ReactNode, maxWidth?: number | string }) => {
  return (
    <MainContainer maxWidth={maxWidth} >
      {children}
    </MainContainer>
  )
}

interface SideBarProps extends Omit<ViewProps, 'padding'> {
  children: React.ReactNode
  isSticky?: boolean
  maxWidth?: number | string
  padding?: UseLayoutSpacingOptions
}

const SideBarComponent = ({ children, isSticky, maxWidth = 320, padding = 'right', ...props }: SideBarProps) => {
  const spacingValues = useLayoutSpacing(padding)
  return (
    <LayoutSideBar
      isSticky={isSticky}
      maxWidth={maxWidth}
      ml={spacingValues.paddingLeft}
      mr={spacingValues.paddingRight}
      pt={spacingValues.paddingTop}
      pb={spacingValues.paddingBottom}
      {...props}
    >
      {children}
    </LayoutSideBar>
  )
}

export default withStaticProperties(Layout, {
  Container,
  Main,
  SideBar: SideBarComponent,
})
