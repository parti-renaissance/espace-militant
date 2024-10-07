import { PropsWithChildren } from 'react'
import { Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Spacing } from '@/styles'
import { gray } from '@tamagui/colors'
import { X } from '@tamagui/lucide-icons'
import { Sheet, useMedia, View } from 'tamagui'

interface ModalOrPageBaseProps extends PropsWithChildren {
  onClose?: () => void
  open?: boolean
  shouldDisplayCloseHeader?: boolean
  header: React.ReactNode
  scrollable?: boolean
}

/**
 * This component create a centered modal in md and more viewport, or a page in small ones
 * @constructor
 */
export default function ModalOrPageBase({ children, onClose, open, shouldDisplayCloseHeader, header, scrollable }: ModalOrPageBaseProps) {
  const viewport = useMedia()
  const insets = useSafeAreaInsets()

  if (viewport.gtMd) {
    return (
      <Modal animationType={'fade'} transparent visible={!!open}>
        <View
          style={styles.centeredView}
          onPress={(e) => {
            onClose?.()
          }}
        >
          <View
            onPress={(e) => {
              e.stopPropagation()
            }}
            style={styles.modalView}
          >
            {children}
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
      moveOnKeyboardChange
      onOpenChange={(x) => {
        if (!x) {
          onClose?.()
        }
      }}
    >
      <Sheet.Frame>
        {shouldDisplayCloseHeader && (
          <TouchableOpacity style={[styles.header, { paddingTop: insets.top }]} onPress={onClose}>
            <X />
          </TouchableOpacity>
        )}

        {header}

        <Sheet.ScrollView
          scrollEnabled={scrollable}
          keyboardShouldPersistTaps={'handled'}
          automaticallyAdjustKeyboardInsets
          backgroundColor={'white'}
          contentContainerStyle={{
            // paddingBottom: 250,
            flexGrow: 1,
          }}
        >
          {children}
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  mediumView: {
    height: '100%',
    paddingBottom: 2000,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    cursor: 'pointer',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 32,
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
  header: {
    paddingVertical: Spacing.margin,
    paddingLeft: Spacing.margin,
    borderBottomWidth: 2,
    elevation: 1,
    borderBottomColor: gray.gray2,
  },
})
