import React, { PropsWithChildren } from 'react'
import { Dimensions, Modal, Platform, ScrollView, StyleSheet } from 'react-native'
import { CardFrame } from '@/components/VoxCard/VoxCard'
import { Spacing } from '@/styles'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { isWeb, useMedia, useWindowDimensions, View } from 'tamagui'

interface ModalOrPageBaseProps extends PropsWithChildren {
  onClose?: () => void
  open?: boolean
  header?: React.ReactNode
  maxWidth?: number
  height?: 'auto' | undefined
}

export const useModalOrPageScrollView = () => {
  return ScrollView
}

/**
 * This component create a centered modal in sm and more viewport, or a page in small ones
 * @constructor
 */
export default function ViewportModal({ children, onClose, open, header, maxWidth = 1048, height }: ModalOrPageBaseProps) {
  const viewport = useMedia()
  const size = useWindowDimensions()

  const width = Math.min((size.width * 80) / 100, maxWidth)
  const modalHeight = height === 'auto' ? 'auto' : (size.height * 60) / 100

  if (viewport.gtSm && isWeb) {
    return (
      <Modal animationType={'fade'} transparent visible={!!open}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <CardFrame width={width} height={modalHeight}>
              <BottomSheetModalProvider>
                {header ? header : null}
                {children}
              </BottomSheetModalProvider>
            </CardFrame>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={!!open}
    >
      <View style={styles.fullScreenView}>
        <BottomSheetModalProvider>
          {header ? header : null}
          {children}
        </BottomSheetModalProvider>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    cursor: 'pointer',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: Spacing.largeMargin,
    alignItems: 'center',
    cursor: 'auto',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fullScreenView: {
    flex: Platform.OS === 'android' ? undefined : 1,
    width: Platform.OS === 'android' ? Dimensions.get('window').width : undefined,
    height: Platform.OS === 'android' ? Dimensions.get('window').height : undefined,
    backgroundColor: 'white',
  },
})
