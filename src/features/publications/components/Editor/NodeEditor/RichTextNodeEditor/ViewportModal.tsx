import { PropsWithChildren } from 'react'
import { Modal, Platform, ScrollView, StyleSheet } from 'react-native'
import { CardFrame } from '@/components/VoxCard/VoxCard'
import { Spacing } from '@/styles'
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

  const width = Math.min((size.width * 80) / 100, 520)
  const height = 500

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
    <Sheet
      modal
      open={!!open}
      snapPoints={[100]}
      snapPointsMode="percent"
      disableDrag
      dismissOnSnapToBottom={false}
      dismissOnOverlayPress={false}
      onOpenChange={(x) => {
        if (!x) {
          onClose?.()
        }
      }}
    >
      <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame onPress={(e) => Platform.OS === 'ios' ? e.stopPropagation() : null}>
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
