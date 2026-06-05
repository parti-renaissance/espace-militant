import React, { PropsWithChildren, useEffect, useRef } from 'react'
import { Modal, Platform, Pressable, StyleSheet, View as RNView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollView, useMedia, View } from 'tamagui'
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'

import useKeyboardHeight from '@/hooks/useKeyboardHeight'
import { Spacing } from '@/styles'

interface ModalOrPageBaseProps extends PropsWithChildren {
  onClose?: () => void
  open?: boolean
  allowDrag?: boolean
  snapPoints?: number[]
}

export default function ModalOrBottomSheet({ children, onClose, open, snapPoints, allowDrag }: ModalOrPageBaseProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const viewport = useMedia()
  const insets = useSafeAreaInsets()

  const rawKeyboardHeight = useKeyboardHeight()
  const keyboardHeight = typeof rawKeyboardHeight === 'number' && !isNaN(rawKeyboardHeight) ? rawKeyboardHeight : 0

  useEffect(() => {
    if (!bottomSheetModalRef.current) return

    if (!open) {
      bottomSheetModalRef.current.close()
      return
    }

    let cancelled = false
    const frameId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) {
          bottomSheetModalRef.current?.present()
        }
      })
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frameId)
    }
  }, [open])

  const onCloseModal = () => {
    onClose?.()
    bottomSheetModalRef.current?.close()
  }

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />
  )

  if (viewport.gtSm) {
    return (
      <Modal animationType="fade" transparent visible={!!open}>
        <View style={styles.centeredView}>
          <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
            <Pressable style={styles.backdrop} onPress={(event) => event.target === event.currentTarget && onClose?.()}>
              <View style={styles.modalView}>{children}</View>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={allowDrag}
      enableOverDrag={false}
      onDismiss={onCloseModal}
      topInset={insets.top}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      handleIndicatorStyle={styles.handleIndicator}
      style={styles.bottomSheet}
    >
      <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
        {children}
        {Platform.OS === 'ios' && <RNView style={{ height: keyboardHeight, width: '100%' }} />}
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  centeredView: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  backdrop: { flexGrow: 1, width: '100%', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: Spacing.largeMargin,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContainer: { flexGrow: 1 },
  bottomSheet: { flex: 1 },
  bottomSheetContent: { flexGrow: 1 },
  handleIndicator: { backgroundColor: '#D2DCE5', width: 48 },
})
