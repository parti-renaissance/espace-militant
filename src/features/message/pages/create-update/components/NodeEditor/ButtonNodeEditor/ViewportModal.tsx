import { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { Modal, ScrollView, StyleSheet } from 'react-native'
import { CardFrame } from '@/components/VoxCard/VoxCard'
import { Spacing } from '@/styles'
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { isWeb, Sheet, useMedia, useWindowDimensions, View } from 'tamagui'

interface ModalOrPageBaseProps extends PropsWithChildren {
  onClose?: () => void
  open?: boolean
  header?: React.ReactNode
}

export const useModalOrPageScrollView = () => {
  const viewport = useMedia()
  return viewport.gtSm ? ScrollView : Sheet.ScrollView
}

/**
 * This component create a centered modal in sm and more viewport, or a page in small ones
 * @constructor
 */
export default function ViewportModal({ children, onClose, open, header }: ModalOrPageBaseProps) {
  const viewport = useMedia()
  const size = useWindowDimensions()

  const width = Math.min((size.width * 80) / 100, 500)

  const sheetModalRef = useRef<BottomSheetModal>(null)

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />, [])

  useEffect(() => {
    if (open) {
      sheetModalRef.current?.present()
    } else {
      sheetModalRef.current?.dismiss()
    }
  }, [open])

  if (viewport.gtSm && isWeb) {
    return (
      <Modal animationType={'fade'} transparent visible={!!open}>
        <View style={styles.centeredView} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalView}>
            <CardFrame width={width}>
              {header ? header : null}
              {children}
            </CardFrame>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <BottomSheetModal ref={sheetModalRef} backdropComponent={renderBackdrop} detached enablePanDownToClose={false} onDismiss={onClose} enableDismissOnClose>
      <BottomSheetScrollView stickyHeaderIndices={[0]} style={{ flex: 1 }}>
        {header}
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
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
