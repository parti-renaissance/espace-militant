import { forwardRef, PropsWithChildren, useImperativeHandle, useState } from 'react'
import { Modal, StyleSheet } from 'react-native'
import { Spacing } from '@/styles'
import { View } from 'tamagui'

type ModalRef = {
  present: () => void
  close: () => void
}

const VoxSimpleModal = forwardRef<ModalRef, PropsWithChildren>((props, ref) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      present: () => setOpen(true),
      close: () => setOpen(false),
    }
  }, [])

  return (
    <Modal animationType={'fade'} transparent visible={!!open}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {props.children}
        </View>
      </View>
    </Modal>
  )
})

export default VoxSimpleModal

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    // cursor: 'pointer',
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
