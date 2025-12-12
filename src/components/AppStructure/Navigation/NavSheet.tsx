import React, { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { styled, YStack } from 'tamagui'
import { NavItem } from '@/components/AppStructure/Navigation/NavItem'
import { type NavItemConfig } from '@/config/navigationItems'

const Line = styled(YStack, {
  backgroundColor: '$purple3',
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
}

export interface NavSheetRef {
  expand: () => void
  close: () => void
}

const NavSheet = forwardRef<NavSheetRef, NavSheetProps>(({ onClose, items, ListHeaderComponent, ListFooterComponent, showLine = false }, ref) => {
  const insets = useSafeAreaInsets()
  const bsRef = useRef<BottomSheet>(null)
  const zIndex = useSharedValue(-10)
  const [currentIndex, setCurrentIndex] = useState(-1)

  const handleSheetChange = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    onClose?.()
    zIndex.value = -10
    setCurrentIndex(-1)
  }, [onClose])

  useImperativeHandle(ref, () => {
    return {
      expand: () => {
        bsRef.current?.expand()
        zIndex.value = 10
        setCurrentIndex(0)
      },
      close: () => {
        bsRef.current?.close()
        zIndex.value = -10
        setCurrentIndex(-1)
      },
    }
  })

  const styleContainer = useAnimatedStyle(() => {
    return {
      zIndex: zIndex.value,
    }
  })

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />
  ), [])

  return (
    <Animated.View style={[styles.container, { bottom: 54 + insets.bottom + 10 }, styleContainer]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheet
          ref={bsRef}
          index={currentIndex}
          onChange={handleSheetChange}
          backdropComponent={renderBackdrop}
          onClose={handleClose}
          enablePanDownToClose
          topInset={insets.top}
          handleIndicatorStyle={{
            backgroundColor: '#D2DCE5',
            width: 48,
          }}
        >
          <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
            <YStack paddingVertical={8}>
              {ListHeaderComponent && (
                <YStack>
                  {ListHeaderComponent}
                </YStack>
              )}
              <YStack gap={4} paddingHorizontal={16}>
                {showLine && <Line />}
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

              {ListFooterComponent && (
                <YStack>
                  {ListFooterComponent}
                </YStack>
              )}
            </YStack>
          </BottomSheetScrollView>
        </BottomSheet>
      </GestureHandlerRootView>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    pointerEvents: 'box-none',
    top: 0,
    left: 0,
    right: 0,
    bottom: 54,
  },
  contentContainer: {
    width: '100%',
    paddingBottom: 20,
  },
})

export default memo(NavSheet)

