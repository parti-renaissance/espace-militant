import React, { PropsWithChildren } from 'react'
import { Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { CardFrame } from '@/components/VoxCard/VoxCard'
import { Spacing } from '@/styles'
import { isWeb, useMedia, useWindowDimensions, View } from 'tamagui'

interface ModalOrPageBaseProps extends PropsWithChildren {
  onClose?: () => void
  open?: boolean
  header?: React.ReactNode
  maxWidth?: number
}

export const useModalOrPageScrollView = () => {
  return ScrollView
}

/**
 * This component create a centered modal in sm and more viewport, or a page in small ones
 * @constructor
 */
export default function ViewportModal({ children, onClose, open, header, maxWidth = 1048 }: ModalOrPageBaseProps) {
  const viewport = useMedia()
  const size = useWindowDimensions()

  const width = Math.min((size.width * 80) / 100, maxWidth)
  const height = (size.height * 60) / 100

  if (viewport.gtSm && isWeb) {
    return (
      <Modal animationType={'fade'} transparent visible={!!open}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <CardFrame width={width} height={height}>
              {header ? header : null}
              {children}
            </CardFrame>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Modal
      animationType="none"
      transparent={false}
      visible={!!open}
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenView}>
        {header ? header : null}
        {children}
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
    flex: 1,
    backgroundColor: 'white',
  },
})
