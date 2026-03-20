import React, { MutableRefObject, PropsWithChildren, ReactNode } from 'react'
import { Modal, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollView, Sheet, useMedia, View } from 'tamagui'
import { gray } from '@tamagui/colors'
import { X } from '@tamagui/lucide-icons'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

import { AuthContext } from '@/ctx/AuthContext'
import { Spacing } from '@/styles'

interface ModalOrPageBaseProps extends PropsWithChildren {
  onClose?: () => void
  open?: boolean
  shouldDisplayCloseHeader?: boolean
  shouldDisplayCloseButton?: boolean
  header?: ReactNode
  scrollable?: boolean
  scrollRef?: MutableRefObject<React.ElementRef<typeof Sheet.ScrollView> | null>
  allowDrag?: boolean
  mobileBackdrop?: boolean
  snapPoints?: number[]
  withKeyboard?: boolean
  modalBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'gtXs' | 'gtSm' | 'gtMd' | 'gtLg' | 'gtXl'
}

/**
 * This component create a centered modal in md and more viewport, or a page in small ones
 * @constructor
 */
export default function ModalOrPageBase({
  children,
  onClose,
  open,
  shouldDisplayCloseHeader,
  shouldDisplayCloseButton,
  header,
  scrollable,
  scrollRef,
  snapPoints,
  allowDrag,
  mobileBackdrop,
  withKeyboard = true,
  modalBreakpoint = 'gtMd',
}: ModalOrPageBaseProps) {
  const viewport = useMedia()
  const insets = useSafeAreaInsets()
  const breakpointKey = modalBreakpoint ?? 'gtMd'
  const isModal = breakpointKey in viewport ? Boolean(viewport[breakpointKey as keyof typeof viewport]) : viewport.gtMd
  const authContextValue = React.useContext(AuthContext)
  const modalContent = authContextValue ? (
    <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
  ) : (
    children
  )

  if (isModal) {
    return (
      <Modal animationType={'fade'} transparent visible={!!open}>
        <Pressable style={styles.centeredView} onPress={(event) => event.target == event.currentTarget && onClose?.()}>
          <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
            <View style={styles.modalView}>
              {modalContent}
              {shouldDisplayCloseButton ? (
                <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, padding: 14 }} onPress={onClose}>
                  <X />
                </TouchableOpacity>
              ) : null}
            </View>
          </ScrollView>
        </Pressable>
      </Modal>
    )
  }

  return (
    <Sheet
      modal
      open={!!open}
      snapPoints={snapPoints ?? [100]}
      snapPointsMode={'percent'}
      disableDrag={!allowDrag}
      moveOnKeyboardChange={withKeyboard}
      onOpenChange={(x) => {
        if (!x) {
          onClose?.()
        }
      }}
    >
      {mobileBackdrop && <Sheet.Overlay animation="lazy" backgroundColor="$shadow6" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />}
      <Sheet.Frame>
        <BottomSheetModalProvider>
          {shouldDisplayCloseHeader && (
            <TouchableOpacity style={[styles.header, { paddingTop: insets.top }]} onPress={onClose}>
              <X />
            </TouchableOpacity>
          )}

          {header}

          {scrollable === false ? (
            modalContent
          ) : (
            <ScrollView
              ref={scrollRef}
              scrollEnabled={scrollable}
              keyboardShouldPersistTaps={'handled'}
              automaticallyAdjustKeyboardInsets={withKeyboard}
              backgroundColor={'white'}
              contentContainerStyle={{
                flexGrow: 1,
              }}
            >
              {modalContent}
            </ScrollView>
          )}
        </BottomSheetModalProvider>
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
  header: {
    paddingVertical: Spacing.margin,
    paddingLeft: Spacing.margin,
    borderBottomWidth: 2,
    elevation: 1,
    borderBottomColor: gray.gray2,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
