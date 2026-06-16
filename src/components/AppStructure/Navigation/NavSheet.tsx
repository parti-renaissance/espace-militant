import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { styled, YStack } from 'tamagui'
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView } from '@gorhom/bottom-sheet'

import { NavItem } from '@/components/AppStructure/Navigation/NavItem'

import { type NavItemConfig } from '@/config/navigationItems'

const Line = styled(YStack, {
  backgroundColor: '$pink3',
  position: 'absolute',
  left: 36,
  top: -12,
  bottom: 16,
  width: 1,
})

interface NavSheetProps {
  onClose?: () => void
  items: NavItemConfig[]
  ListHeaderComponent?: React.ReactNode
  ListFooterComponent?: React.ReactNode
  showLine?: boolean
  /** Reserved height at the bottom for the tab bar layer (includes safe area when measured from FloatingTabBar). */
  tabBarOffset?: number
  /** Extra padding at the bottom of the scroll content so items clear the tab bar. */
  contentBottomPadding?: number
  /** Keep the sheet behind the tab bar instead of covering it. */
  behindTabBar?: boolean
}

export const DEFAULT_NAV_SHEET_TAB_BAR_OFFSET = 64
const SCROLL_CONTENT_PADDING = 20

export interface NavSheetRef {
  expand: () => void
  close: () => void
}

const NavSheet = forwardRef<NavSheetRef, NavSheetProps>(
  (
    {
      onClose,
      items,
      ListHeaderComponent,
      ListFooterComponent,
      showLine = false,
      tabBarOffset = DEFAULT_NAV_SHEET_TAB_BAR_OFFSET,
      contentBottomPadding,
      behindTabBar = false,
    },
    ref,
  ) => {
    const insets = useSafeAreaInsets()
    const bsRef = useRef<BottomSheet>(null)
    const zIndex = useSharedValue(-10)
    const [currentIndex, setCurrentIndex] = useState(-1)
    const openZIndex = behindTabBar ? 10 : 110
    const tabBarZoneHeight = behindTabBar ? tabBarOffset : 0
    const scrollBottomPadding = contentBottomPadding ?? (behindTabBar ? tabBarZoneHeight + SCROLL_CONTENT_PADDING : 20)
    const bottomInset = behindTabBar ? tabBarOffset : tabBarOffset + insets.bottom
    const sheetBottomInset = behindTabBar ? 0 : insets.bottom

    const isOpen = currentIndex >= 0

    const scrollContentContainerStyle = useMemo(
      () => ({
        width: '100%' as const,
        paddingBottom: scrollBottomPadding,
        paddingTop: 8,
        ...(behindTabBar ? { flexGrow: 0 as const } : {}),
      }),
      [behindTabBar, scrollBottomPadding],
    )

    const handleSheetChange = useCallback((index: number) => {
      setCurrentIndex(index)
    }, [])

    const [closeRequested, setCloseRequested] = useState(false)

    useEffect(() => {
      if (!closeRequested) return
      zIndex.value = -10
      setCurrentIndex(-1)
      setCloseRequested(false)
    }, [closeRequested, zIndex])

    const handleClose = useCallback(() => {
      onClose?.()
      setCloseRequested(true)
    }, [onClose])

    useImperativeHandle(ref, () => {
      return {
        expand: () => {
          zIndex.value = openZIndex
          bsRef.current?.expand()
        },
        close: () => {
          bsRef.current?.close()
        },
      }
    })

    const styleContainer = useAnimatedStyle(() => ({
      zIndex: zIndex.value,
    }))

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
      [],
    )

    return (
      <Animated.View
        pointerEvents={isOpen ? 'box-none' : 'none'}
        style={[styles.container, behindTabBar ? styles.containerBehindTabBar : { bottom: bottomInset }, styleContainer]}
      >
        <BottomSheet
          ref={bsRef}
          index={-1}
          onChange={handleSheetChange}
          backdropComponent={renderBackdrop}
          onClose={handleClose}
          enablePanDownToClose={isOpen}
          enableDynamicSizing
          enableContentPanningGesture={isOpen && !behindTabBar}
          enableHandlePanningGesture={isOpen}
          topInset={insets.top}
          bottomInset={sheetBottomInset}
          style={[
            behindTabBar ? styles.sheetBehindTabBar : undefined,
            !isOpen ? ({ pointerEvents: 'none' } as const) : undefined,
          ]}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={{
            backgroundColor: '#D2DCE5',
            width: 48,
          }}
        >
          <BottomSheetScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled contentContainerStyle={scrollContentContainerStyle}>
            {ListHeaderComponent ? <YStack>{ListHeaderComponent}</YStack> : null}
            <YStack gap={4} paddingHorizontal={16}>
              {showLine ? <Line /> : null}
              {items.map((item) => (
                <NavItem
                  key={item.id}
                  text={item.text}
                  iconLeft={item.iconLeft}
                  href={item.href}
                  isNew={item.isNew}
                  externalLink={item.externalLink}
                  disabled={item.disabled}
                  active={item.active}
                  onPress={() => {
                    item.onPress?.()
                    bsRef.current?.close()
                  }}
                  theme={item.theme}
                  frame={item.frame}
                />
              ))}
            </YStack>

            {ListFooterComponent ? <YStack>{ListFooterComponent}</YStack> : null}
          </BottomSheetScrollView>
        </BottomSheet>
      </Animated.View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  containerBehindTabBar: {
    bottom: 0,
  },
  sheetBehindTabBar: {},
  sheetBackground: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
})

export default memo(NavSheet)
