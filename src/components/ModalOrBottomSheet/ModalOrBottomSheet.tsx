import React, { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { Modal, Platform, Pressable, StyleSheet } from 'react-native'
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

/**
 * This component create a centered modal in md and more viewport, or a page in small ones
 * @constructor
 */
export default function ModalOrBottomSheet({ children, onClose, open, snapPoints, allowDrag }: ModalOrPageBaseProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const viewport = useMedia()
  const isDesktop = viewport.gtSm
  const prevIsDesktop = useRef(isDesktop)
  const insets = useSafeAreaInsets()

  // for iOS only
  const keyboardHeight = useKeyboardHeight()

  // Desktop uses <Modal>, mobile uses <BottomSheetModal> — switching viewport unmounts
  // one without calling onClose, leaving open=true in the parent (clicks then no-op).
  useLayoutEffect(() => {
    if (prevIsDesktop.current !== isDesktop) {
      prevIsDesktop.current = isDesktop
      if (open) onClose?.()
    }
  }, [isDesktop, open, onClose])

  useEffect(() => {
    if (isDesktop || !bottomSheetModalRef.current) return
    if (open) {
      bottomSheetModalRef.current.present()
    } else {
      bottomSheetModalRef.current.close()
    }
  }, [open, isDesktop])

  const onCloseModal = useCallback(() => {
    onClose?.()
    bottomSheetModalRef.current?.close()
  }, [onClose])

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />, [])

  if (isDesktop) {
    return (
      <Modal animationType={'fade'} transparent visible={!!open}>
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
      handleIndicatorStyle={{
        backgroundColor: '#D2DCE5',
        width: 48,
      }}
      style={{ width: '100%' }}
    >
      <BottomSheetScrollView contentContainerStyle={{ width: '100%' }}>
        {children}

        {/* In iOS we need to pass a view of specific height as paddingBottom won't work as expected. */}
        {Platform.OS === 'ios' && <View style={{ height: keyboardHeight }} />}
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  scrollContainer: {
    flexGrow: 1,
  },
})
