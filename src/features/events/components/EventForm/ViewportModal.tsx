import { PropsWithChildren } from 'react'
import { Modal, ScrollView, StyleSheet } from 'react-native'
import { CardFrame } from '@/components/VoxCard/VoxCard'
import { Spacing } from '@/styles'
import { Sheet, useMedia, View } from 'tamagui'

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

  if (viewport.gtSm) {
    return (
      <Modal animationType={'fade'} transparent visible={!!open}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <CardFrame>
              {header ? header : null}
              {children}
            </CardFrame>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Sheet
      modal
      open={!!open}
      snapPoints={[80]}
      snapPointsMode="percent"
      disableDrag
      moveOnKeyboardChange
      dismissOnSnapToBottom={false}
      dismissOnOverlayPress={true}
      onOpenChange={(x) => {
        if (!x) {
          onClose?.()
        }
      }}
    >
      <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame>
        {header ? header : null}
        {children}
      </Sheet.Frame>
    </Sheet>
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
