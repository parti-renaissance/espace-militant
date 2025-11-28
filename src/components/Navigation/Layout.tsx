import React, { useRef } from 'react'
import { ScrollView, View, XStack, styled, withStaticProperties, ViewProps, useMedia, isWeb } from 'tamagui'
import { StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SideBar, SideBarState } from '@/components/Navigation/SideBar'
import ConfigurableTabBar from '@/components/Navigation/TabBar'
import { YStack } from 'tamagui'
import { ScrollContext } from './scrollContext'

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
        $lg: {
          top: 8 + SAFE_AREA_PADDING,
        },
        $xl: {
          top: 12 + SAFE_AREA_PADDING,
        },
        top: 16 + SAFE_AREA_PADDING,
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

  return (
    <LayoutRoot {...props}>
      <LayoutWrapper>
        {sidebarState && media.gtSm && <SideBar state={sidebarState} />}
        {children}
      </LayoutWrapper>
      {!media.gtSm && <ConfigurableTabBar hide={hideTabBar} />}
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

const Container = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets()
  const layoutRef = useRef<HTMLDivElement>(null)
  const media = useMedia()

  return (
    <YStack alignItems="center"
      ref={layoutRef}
      flex={1}
      bg="$textSurface"
      pl={media.gtLg ? insets.left : (media.gtMd ? (insets.left) : insets.left)}
      pr={insets.right}
      overflowY={isWeb ? 'auto' : undefined}
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

interface SideBarProps extends ViewProps {
  children: React.ReactNode
  isSticky?: boolean
  maxWidth?: number | string
}

const SideBarComponent = ({ children, isSticky, maxWidth = 320, ...props }: SideBarProps) => {
  return (
    <LayoutSideBar isSticky={isSticky} maxWidth={maxWidth} {...props}>
      {children}
    </LayoutSideBar>
  )
}

export const useLayoutPadding = (
  options: {
    safeArea?: boolean
    safeAreaTop?: boolean
    safeAreaBottom?: boolean
    safeAreaLeft?: boolean
    safeAreaRight?: boolean
  } = {}
) => {
  const media = useMedia()
  const insets = useSafeAreaInsets()

  let py = 16
  if (media.xl) py = 12
  if (media.lg) py = 8
  if (media.sm) py = 8

  let px = 32
  if (media.xl) px = 24
  if (media.lg) px = 16
  if (media.sm) px = 0

  const enableTop = options.safeAreaTop ?? options.safeArea ?? false
  const enableBottom = options.safeAreaBottom ?? options.safeArea ?? false
  const enableLeft = options.safeAreaLeft ?? options.safeArea ?? false
  const enableRight = options.safeAreaRight ?? options.safeArea ?? false

  return {
    paddingTop: py + SAFE_AREA_PADDING + (enableTop ? insets.top : 0),
    paddingBottom: py + SAFE_AREA_PADDING + (enableBottom ? insets.bottom : 0),
    paddingLeft: px + (enableLeft ? insets.left : 0),
    paddingRight: px + (enableRight ? insets.right : 0),
  }
}

export default withStaticProperties(Layout, {
  Container,
  Main,
  SideBar: SideBarComponent,
})
