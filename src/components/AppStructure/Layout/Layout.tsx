import React, { useCallback, useMemo, useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { isWeb, styled, useMedia, View, ViewProps, withStaticProperties, XStack, YStack } from 'tamagui'

import useLayoutSpacing, { UseLayoutSpacingOptions } from '@/components/AppStructure/hooks/useLayoutSpacing'
import { SideBar, SideBarState } from '@/components/AppStructure/Navigation/SideBar'
import ConfigurableTabBar from '@/components/AppStructure/Navigation/TabBar'
import { SignInButton, SignUpButton } from '@/components/Buttons/AuthButton'

import EuCampaignIllustration from '@/assets/illustrations/EuCampaignIllustration'
import { useCadreNavItems } from '@/config/navigationItems'
import { useSession } from '@/ctx/SessionProvider'

import Header from '../Header'
import { ScrollContext, useLayoutContext } from './LayoutContext'

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
  const { isAuth } = useSession()

  return (
    <LayoutRoot {...props}>
      {media.sm && !isAuth ? (
        <Header title="">
          <XStack alignItems="center" justifyContent="space-between" width="100%">
            <EuCampaignIllustration showText={false} />
            <XStack gap="$small">
              <SignInButton />
              <SignUpButton />
            </XStack>
          </XStack>
        </Header>
      ) : null}
      <LayoutWrapper>
        {sidebarState && media.gtSm && <SideBar state={sidebarState} navCadreItems={cadreNavItems} />}
        {children}
      </LayoutWrapper>
      {!media.gtSm && isAuth && <ConfigurableTabBar hide={hideTabBar} navCadreItems={cadreNavItems} />}
    </LayoutRoot>
  )
}

/** Align with `Main` / `SideBar` default max widths and `ContentContainer` gaps. */
const LAYOUT_MAIN_MAX_WIDTH = 520
const LAYOUT_SIDEBAR_MAX_WIDTH = 320

const ContentContainer = styled(XStack, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'flex-start',
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
  /** Full-width block above the main + sidebar row (same horizontal padding as content). */
  banner?: React.ReactNode
  hideSideBar?: boolean
  hideTabBar?: boolean
  sidebarState?: SideBarState
  safeHorizontalPadding?: boolean
  alwaysShowScrollbar?: boolean
  floatingContent?: React.ReactNode
}

const Container = ({
  children,
  banner,
  hideSideBar,
  hideTabBar,
  sidebarState,
  safeHorizontalPadding = true,
  alwaysShowScrollbar = false,
  floatingContent,
  ...props
}: ContainerProps) => {
  const insets = useSafeAreaInsets()
  const layoutRef = useRef<HTMLDivElement>(null)
  const media = useMedia()
  const { setHideSideBar, setHideTabBar, setSidebarState, setFloatingContent } = useLayoutContext()
  const spacingValues = useLayoutSpacing({ left: true, right: true })

  useFocusEffect(
    useCallback(() => {
      setSidebarState(sidebarState ?? 'militant')
      setHideSideBar(hideSideBar ?? false)
      setHideTabBar(hideTabBar ?? false)
      setFloatingContent(floatingContent ?? null)
    }, [hideSideBar, hideTabBar, setHideSideBar, setHideTabBar, setFloatingContent, setSidebarState, sidebarState, floatingContent]),
  )

  const scrollBehavior = alwaysShowScrollbar ? 'scroll' : 'auto'

  const horizontalContentStyle = safeHorizontalPadding
    ? {
        paddingLeft: spacingValues.paddingLeft,
        paddingRight: spacingValues.paddingRight,
      }
    : undefined

  const mainPlusSidebarMaxWidth = useMemo(() => {
    const rowGap = media.gtXl ? 24 : media.gtLg ? 16 : 32
    return media.gtMd ? LAYOUT_MAIN_MAX_WIDTH + rowGap + LAYOUT_SIDEBAR_MAX_WIDTH : LAYOUT_MAIN_MAX_WIDTH
  }, [media.gtLg, media.gtMd, media.gtXl])

  return (
    <YStack
      alignItems="center"
      ref={layoutRef}
      flex={1}
      bg="$textSurface"
      pl={media.gtLg ? insets.left : media.gtMd ? insets.left : insets.left}
      pr={insets.right}
      overflowY={isWeb ? scrollBehavior : undefined}
      {...props}
    >
      <YStack width="100%" flexGrow={1}>
        <ScrollContext.Provider value={{ layoutRef: layoutRef as React.RefObject<HTMLDivElement>, scrollActive: Boolean(isWeb) }}>
          <YStack width="100%" flex={1}>
            {banner != null ? (
              <YStack width="100%" flex={1} alignItems="center" style={horizontalContentStyle}>
                <YStack width="100%" flex={1} maxWidth={mainPlusSidebarMaxWidth}>
                  <YStack width="100%">{banner}</YStack>
                  <ContentContainer flex={1} width="100%">
                    {children}
                  </ContentContainer>
                </YStack>
              </YStack>
            ) : (
              <ContentContainer style={horizontalContentStyle} flex={1}>
                {children}
              </ContentContainer>
            )}
          </YStack>
        </ScrollContext.Provider>
      </YStack>
    </YStack>
  )
}

const MainContainer = styled(View, {
  flex: 2,
  maxWidth: LAYOUT_MAIN_MAX_WIDTH,
  $sm: {
    maxWidth: '100%',
  },
})

const Main = ({ children, maxWidth = LAYOUT_MAIN_MAX_WIDTH, ...props }: ViewProps & { children: React.ReactNode; maxWidth?: number | string }) => {
  return (
    <MainContainer maxWidth={maxWidth} {...props}>
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

const SideBarComponent = ({ children, isSticky, maxWidth = LAYOUT_SIDEBAR_MAX_WIDTH, minWidth = 280, padding = 'right', ...props }: SideBarProps) => {
  const spacingValues = useLayoutSpacing(padding)
  return (
    <LayoutSideBar isSticky={isSticky} maxWidth={maxWidth} minWidth={minWidth} pt={spacingValues.paddingTop} pb={spacingValues.paddingBottom} {...props}>
      {children}
    </LayoutSideBar>
  )
}

export default withStaticProperties(Layout, {
  Container,
  Main,
  SideBar: SideBarComponent,
})
