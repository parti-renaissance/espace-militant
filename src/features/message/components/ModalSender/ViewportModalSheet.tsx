import { forwardRef, PropsWithChildren, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { Modal, StyleSheet } from 'react-native'
import { CardFrame } from '@/components/VoxCard/VoxCard'
import { Spacing } from '@/styles'
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { isWeb, useMedia, useWindowDimensions, View } from 'tamagui'

export interface ViewportModalSheet extends PropsWithChildren {
  onClose?: () => void
  header?: React.ReactNode
}

export type ViewportModalRef = {
  present: () => void
  dismiss: () => void
}

const ViewportModal = forwardRef<ViewportModalRef, ViewportModalSheet>(({ children, onClose, header }, ref) => {
  const [open, setOpen] = useState(false)
  const viewport = useMedia()
  const size = useWindowDimensions()

  const width = Math.min((size.width * 80) / 100, 500)

  useImperativeHandle(ref, () => ({
    present: () => {
      setOpen(true)
    },
    dismiss: () => {
      setOpen(false)
      onClose?.()
    },
  }))

  if (viewport.gtSm && isWeb) {
    return (
      <Modal animationType={'fade'} transparent visible={!!open}>
        <View
          style={styles.centeredView}
          onPress={(e) => {
            e.stopPropagation()
            e.target == e.currentTarget && onClose?.()
          }}
        >
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
})

const ViewportSheet = forwardRef<ViewportModalRef, ViewportModalSheet>(({ children, onClose, header }, ref) => {
  const sheetModalRef = useRef<BottomSheetModal>(null)

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />, [])

  useImperativeHandle(ref, () => ({
    present: () => {
      sheetModalRef.current?.present()
    },
    dismiss: () => {
      sheetModalRef.current?.dismiss()
    },
  }))

  return (
    <BottomSheetModal ref={sheetModalRef} backdropComponent={renderBackdrop} onDismiss={onClose} enableDismissOnClose>
      <BottomSheetScrollView stickyHeaderIndices={[0]} style={{ flex: 1 }}>
        {header}
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
})

const ViewportModalSheet = forwardRef<ViewportModalRef, ViewportModalSheet>((props, ref) => {
  const viewport = useMedia()
  return viewport.gtSm && isWeb ? <ViewportModal ref={ref} {...props} /> : <ViewportSheet ref={ref} {...props} />
})

export default ViewportModalSheet

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
