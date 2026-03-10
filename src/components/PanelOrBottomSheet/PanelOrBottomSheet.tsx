import { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Modal, Pressable, StyleSheet } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { scheduleOnRN } from 'react-native-worklets'
import { ScrollView, useMedia, View, YStack } from 'tamagui'
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'

interface PanelOrBottomSheetProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
  snapPoints?: (number | string)[]
}

const PANEL_WIDTH_LG = 390
const PANEL_WIDTH_BELOW_LG = 340
const ANIMATION = { duration: 300, easing: Easing.out(Easing.cubic) }

export default function PanelOrBottomSheet({ isOpen, onClose, children, snapPoints }: PanelOrBottomSheetProps) {
  const media = useMedia()
  const isMobile = !media.gtSm
  const panelWidth = media.gtLg ? PANEL_WIDTH_LG : PANEL_WIDTH_BELOW_LG

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const insets = useSafeAreaInsets()

  const translateX = useSharedValue(panelWidth)
  const backdropOpacity = useSharedValue(0)
  const [shouldRenderDesktop, setShouldRenderDesktop] = useState(isOpen)

  const hideDesktopPanel = useCallback(() => {
    setShouldRenderDesktop(false)
  }, [])

  useEffect(() => {
    if (isMobile && bottomSheetModalRef.current) {
      if (isOpen) {
        bottomSheetModalRef.current.present()
      } else {
        bottomSheetModalRef.current.close()
      }
    }
  }, [isOpen, isMobile])

  useLayoutEffect(() => {
    if (isOpen && !isMobile) {
      queueMicrotask(() => setShouldRenderDesktop(true))
    }
  }, [isOpen, isMobile])

  useEffect(() => {
    if (!isMobile) {
      if (!isOpen && translateX.value !== 0 && translateX.value !== panelWidth) {
        translateX.value = panelWidth
      }

      translateX.value = withTiming(isOpen ? 0 : panelWidth, ANIMATION, (finished) => {
        if (finished && !isOpen) {
          scheduleOnRN(hideDesktopPanel) // <-- Utilisation safe v4
        }
      })
      backdropOpacity.value = withTiming(isOpen ? 0.5 : 0, ANIMATION)
    } else {
      queueMicrotask(() => setShouldRenderDesktop(false))
    }
    // translateX et backdropOpacity sont des shared values Reanimated (refs stables), pas des deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isMobile, panelWidth, hideDesktopPanel])

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />, [])

  const animatedPanelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  if (isMobile) {
    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={!snapPoints}
        onDismiss={onClose}
        backdropComponent={renderBackdrop}
        topInset={insets.top}
        enablePanDownToClose
        enableOverDrag={false}
        keyboardBehavior="extend" // <-- Gère le clavier sans hook custom gourmand
        handleIndicatorStyle={styles.handleIndicator}
        style={styles.mobileModal}
      >
        <BottomSheetScrollView contentContainerStyle={styles.mobileScrollContent}>
          <View flex={1}>{children}</View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    )
  }

  if (!shouldRenderDesktop && !isOpen) {
    return null
  }

  return (
    <Modal transparent visible={shouldRenderDesktop || isOpen} animationType="none">
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, animatedBackdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.desktopPanelPosition,
          { width: panelWidth },
          animatedPanelStyle,
          styles.desktopPanelShadow,
        ]}
      >
        <YStack flex={1} backgroundColor="$background" elevation="$4" borderLeftWidth={1} borderColor="$borderColor">
          <ScrollView flex={1} contentContainerStyle={styles.desktopScrollContent}>
            {children}
          </ScrollView>
        </YStack>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  handleIndicator: { backgroundColor: '#D2DCE5', width: 48 },
  mobileModal: { width: '100%' },
  mobileScrollContent: { width: '100%' },
  backdrop: { backgroundColor: 'black' },
  desktopPanelPosition: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },
  desktopPanelShadow: {
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  desktopScrollContent: { flexGrow: 1 },
})
