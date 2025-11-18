import React, { useCallback, useEffect, useState, cloneElement, isValidElement } from 'react'
import { FlatList, GestureResponderEvent, Modal } from 'react-native'
import { styled, XStack, YStack } from 'tamagui'
import { DropdownFrame, DropdownItem } from '../base/Dropdown'
import type { IconComponent } from '@/models/common.model'
import Text from '../base/Text'
import { Info } from '@tamagui/lucide-icons'

export type NavItemSubItem = {
  id: string
  text: string
  subtitle?: string
  icon?: IconComponent
  href?: string
  onPress?: () => void
  disabled?: boolean
  selected?: boolean
  customContent?: React.ReactNode
}

type NavItemDropdownProps = {
  open: boolean
  onClose: () => void
  subItems: NavItemSubItem[]
  triggerRef: React.RefObject<HTMLElement | null>
  verticalPosition?: 'top' | 'bottom'
  helpText?: string
}

const OverlayContainer = styled(YStack, {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 50,
  pointerEvents: 'box-none',
})

const Overlay = styled(YStack, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  pointerEvents: 'auto',
  zIndex: 1,
})

const DropdownContainer = styled(YStack, {
  position: 'absolute',
  zIndex: 2,
  width: 240,
})

const MemoItem = React.memo(DropdownItem)

export const NavItemDropdown = ({
  open,
  onClose,
  subItems,
  triggerRef,
  verticalPosition = 'bottom',
  helpText,
}: NavItemDropdownProps) => {
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!open || !triggerRef.current) return

    const updatePosition = () => {
      if (!triggerRef.current) return

      const element = triggerRef.current as HTMLElement
      const rect = element.getBoundingClientRect()

      const dropdownLeft = rect.right + 16

      let dropdownTop: number
      if (verticalPosition === 'top') {
        dropdownTop = rect.bottom
      } else {
        dropdownTop = rect.top
      }

      setDropdownPosition({
        top: dropdownTop,
        left: dropdownLeft,
      })
    }

    updatePosition()

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, triggerRef, verticalPosition])

  const handleBackdropPress = useCallback(
    (event: GestureResponderEvent) => {
      if (event.target === event.currentTarget) {
        onClose()
      }
    },
    [onClose],
  )

  const handleSubItemPress = useCallback(
    (subItem: NavItemSubItem) => () => {
      if (subItem.disabled) return
      subItem.onPress?.()
      onClose()
    },
    [onClose],
  )

  if (!open) return null

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <OverlayContainer>
        <Overlay onPress={handleBackdropPress} />

        <DropdownContainer
          top={dropdownPosition.top}
          left={dropdownPosition.left}
          transform={verticalPosition === 'top' ? [{ translateY: '-100%' }] : undefined}
          onStartShouldSetResponder={() => true}
        >
          <DropdownFrame size="lg" p={4} borderRadius={8}>
            {helpText && (
              <XStack p={8} mb={0} mt={4} mx={4} borderRadius={8} bg="$textSurface">
                <YStack flexShrink={1}>
                  <Text.SM primary semibold lineHeight={20}>{helpText}</Text.SM>
                </YStack>
                <YStack p={6}>
                  <Info size={24} color="$blue5" />
                </YStack>
              </XStack>
            )}
            <FlatList
              data={subItems}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                padding: 4,
              }}
              renderItem={({ item, index }) => {
                // Si l'item a un customContent, l'utiliser
                if (item.customContent) {
                  // Wrapper le customContent pour fermer le dropdown au clic
                  if (isValidElement(item.customContent)) {
                    const originalOnPress = (item.customContent as any).props?.onPress
                    const enhancedContent = cloneElement(item.customContent as React.ReactElement<any>, {
                      onPress: (e: any) => {
                        originalOnPress?.(e)
                        item.onPress?.()
                        onClose()
                      },
                    } as any)
                    return <>{enhancedContent}</>
                  }
                  
                  return <>{item.customContent}</>
                }

                // Sinon, utiliser le composant DropdownItem standard
                return (
                  <MemoItem
                    title={item.text}
                    subtitle={item.subtitle}
                    onPress={handleSubItemPress(item)}
                    selected={item.selected ?? false}
                    icon={item.icon}
                    size="lg"
                    last={subItems.length - 1 === index}
                    disabled={item.disabled}
                  />
                )
              }}
            />
          </DropdownFrame>
        </DropdownContainer>
      </OverlayContainer>
    </Modal>
  )
}

