import { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { ScrollView, useMedia, YStack } from 'tamagui'

interface PanelModalProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
}

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
    // translateX et backdropOpacity sont des shared values Reanimated (refs stables), pas des deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, panelWidth, hidePanel])

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
    <Modal transparent visible={shouldRender || isOpen} animationType="none">
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, animatedBackdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.panelPosition, { width: panelWidth }, animatedPanelStyle, styles.panelShadow]}>
        <YStack flex={1} backgroundColor="$background" elevation="$4" borderLeftWidth={isBelowSm ? 0 : 1} borderColor="$borderColor">
          <ScrollView flex={1} contentContainerStyle={styles.scrollContent}>
            {children}
          </ScrollView>
        </YStack>
      </Animated.View>
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
