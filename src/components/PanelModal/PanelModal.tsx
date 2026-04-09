import { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { Easing, Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { ScrollView, useMedia, YStack } from 'tamagui'
import { ToastViewport } from '@tamagui/toast'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

interface PanelModalProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
}

export const PANEL_MODAL_TOAST_VIEWPORT = 'panel-modal'

const PANEL_WIDTH_LG = 390
const PANEL_WIDTH_BELOW_LG = 340
const ANIMATION = { duration: 300, easing: Easing.out(Easing.cubic) }

export default function PanelModal({ isOpen, onClose, children }: PanelModalProps) {
  const media = useMedia()
  const { width: windowWidth } = useWindowDimensions()
  const isBelowSm = !media.gtSm
  const panelWidth = isBelowSm ? windowWidth : media.gtLg ? PANEL_WIDTH_LG : PANEL_WIDTH_BELOW_LG

  const translateX = useSharedValue(panelWidth)
  const backdropOpacity = useSharedValue(0)
  const [shouldRender, setShouldRender] = useState(isOpen)

  const hidePanel = useCallback(() => {
    setShouldRender(false)
  }, [])

  useLayoutEffect(() => {
    if (isOpen) {
      queueMicrotask(() => setShouldRender(true))
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen && translateX.value !== 0 && translateX.value !== panelWidth) {
      translateX.value = panelWidth
    }

    translateX.value = withTiming(isOpen ? 0 : panelWidth, ANIMATION, (finished) => {
      if (finished && !isOpen) {
        scheduleOnRN(hidePanel)
      }
    })
    backdropOpacity.value = withTiming(isOpen ? 0.5 : 0, ANIMATION)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, panelWidth, hidePanel])

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(isBelowSm)
      .activeOffsetX([-10, 10])
      .onUpdate((event) => {
        if (event.translationX > 0) {
          translateX.value = event.translationX
          backdropOpacity.value = interpolate(event.translationX, [0, panelWidth], [0.5, 0], Extrapolation.CLAMP)
        }
      })
      .onEnd((event) => {
        const positionThreshold = panelWidth / 2
        const velocityThreshold = 800

        if (event.translationX > positionThreshold || event.velocityX > velocityThreshold) {
          translateX.value = withTiming(panelWidth, ANIMATION, (finished) => {
            if (finished) {
              scheduleOnRN(onClose)
            }
          })
          backdropOpacity.value = withTiming(0, ANIMATION)
        } else {
          translateX.value = withTiming(0, ANIMATION)
          backdropOpacity.value = withTiming(0.5, ANIMATION)
        }
      })
  }, [isBelowSm, panelWidth, onClose, translateX, backdropOpacity])

  const animatedPanelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  if (!shouldRender && !isOpen) {
    return null
  }

  return (
    <Modal transparent visible={shouldRender || isOpen} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, animatedBackdropStyle]} pointerEvents={isOpen ? 'auto' : 'none'}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.panelPosition, { width: panelWidth }, animatedPanelStyle, styles.panelShadow]}>
          <YStack flex={1} backgroundColor="$background" elevation="$4">
            <BottomSheetModalProvider>
              <ScrollView flex={1} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {children}
              </ScrollView>
            </BottomSheetModalProvider>

            <ToastViewport
              name={PANEL_MODAL_TOAST_VIEWPORT}
              flexDirection="column-reverse"
              position="absolute"
              top={16}
              right={16}
              zIndex={1000}
              pointerEvents="box-none"
            />
          </YStack>
        </Animated.View>
      </GestureDetector>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'black' },
  panelPosition: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },
  panelShadow: {
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  scrollContent: { flexGrow: 1 },
})
