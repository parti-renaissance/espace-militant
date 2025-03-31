import React, { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { Modal, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Spacing } from '@/styles'
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { useMedia, View } from 'tamagui'

interface ModalOrPageBaseProps extends PropsWithChildren {
  onClose?: () => void
  open?: boolean
  allowDrag?: boolean
  snapPoints?: number[]
}

/**
 * This component create a centered modal in md and more viewport, or a page in small ones
 * @constructor
 */
export default function ModalOrBottomSheet({ children, onClose, open, snapPoints, allowDrag }: ModalOrPageBaseProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const viewport = useMedia()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (bottomSheetModalRef.current) {
      if (open) {
        bottomSheetModalRef.current.present()
      } else {
        bottomSheetModalRef.current.close()
      }
    }
  }, [open])

  const onCloseModal = useCallback(() => {
    bottomSheetModalRef.current?.close()
    onClose?.()
  }, [])

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />, [])

  if (viewport.gtMd) {
    return (
      <Modal animationType={'fade'} transparent visible={!!open}>
        <Pressable style={styles.centeredView} onPress={(event) => event.target == event.currentTarget && onClose?.()}>
          <View style={styles.modalView}>{children}</View>
        </Pressable>
      </Modal>
    )
  }

  return (
    <Portal>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          backdropComponent={renderBackdrop}
          enablePanDownToClose={allowDrag}
          enableOverDrag={false}
          onDismiss={onCloseModal}
          topInset={insets.top}
          snapPoints={snapPoints}
          handleIndicatorStyle={{
            backgroundColor: '#D2DCE5',
            width: 48,
          }}
        >
          <BottomSheetScrollView>{children}</BottomSheetScrollView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </Portal>
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
})
