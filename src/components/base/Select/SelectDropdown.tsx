import React, { ComponentRef, forwardRef, ReactNode, RefObject, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { FlatList, GestureResponderEvent, Modal, TouchableOpacity } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { YStack } from 'tamagui'
import { DropdownFrame, DropdownItem, DropdownItemFrame } from '../Dropdown'
import Input from '../Input/Input'
import { ModalDropDownRef, SelectProps } from './types'
import useSelectSearch from './useSelectSearch'
import { reactTextNodeChildrenToString } from './utils'
import Text from '../Text'

type ModalDropDownProps = {
  children: ReactNode
  onClose: () => void
  onKeyPress?: (event: GestureResponderEvent) => void
}

const MemoItem = React.memo(DropdownItem)

const ModalDropDown = forwardRef<ModalDropDownRef, ModalDropDownProps>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [],
  )

  const handleClose = useCallback(() => {
    setIsOpen(false)
    props.onClose()
  }, [props.onClose])

  const handleBackDropClose = useCallback(
    (event: GestureResponderEvent) => {
      if (event.target == event.currentTarget) {
        handleClose()
      }
    },
    [handleClose],
  )

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableOpacity style={{ flex: 1 }} onPress={handleBackDropClose}>
        {props.children}
      </TouchableOpacity>
    </Modal>
  )
})

type DropDownLogicProps = {
  frameRef: RefObject<ComponentRef<typeof TouchableOpacity>>
} & SelectProps<string>

const MIN_WIDTH = 200

export type SelectDropdownRef = ModalDropDownRef & {
  setModalPosition: () => void
}

const SelectDropdown = forwardRef<SelectDropdownRef, DropDownLogicProps>(({ frameRef, options, searchableOptions, resetable, ...props }, ref) => {
  const modalRef = useRef<ModalDropDownRef>(null)
  const dropdownTop = useSharedValue(0)
  const dropdownX = useSharedValue(0)
  const dropdownWidth = useSharedValue(0)
  const { setQuery, filteredItems, queryInputRef, searchableIcon, query } = useSelectSearch({ options, searchableOptions })

  const setModalPosition = useCallback(() => {
    frameRef.current?.measure((_fx, _fy, _w, h, _px, py) => {
      const isMinWidth = _w < MIN_WIDTH
      const x = isMinWidth ? _px - (MIN_WIDTH - _w) / 2 : _px
      const w = isMinWidth ? MIN_WIDTH : _w
      dropdownTop.value = py + h
      dropdownX.value = x
      dropdownWidth.value = w
    })
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        if (frameRef.current) {
          setModalPosition()
          modalRef.current?.open()
        }
        setTimeout(() => queryInputRef.current?.focus(), 100)
      },
      close: () => {
        modalRef.current?.close()
        props.onBlur?.()
      },
      setModalPosition,
    }),
    [],
  )

  const handleClose = () => {
    props.onBlur?.()
    setQuery('')
  }

  const handleSelect = (payload: (typeof filteredItems)[number]) => () => {
    props.onChange?.(payload.id)
    props.onDetailChange?.({
      value: payload.id,
      label: reactTextNodeChildrenToString(payload.title),
      subLabel: payload.subtitle,
    })
    modalRef.current?.close()
    props.onBlur?.()
    setQuery('')
  }

  const dropDownAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: dropdownTop.value,
      left: dropdownX.value,
      width: dropdownWidth.value,
      position: 'absolute',
      maxHeight: 200,
    }
  })
  return (
    <>
      <ModalDropDown onClose={handleClose} ref={modalRef}>
        <Animated.View style={[dropDownAnimatedStyle]}>
          <DropdownFrame width="100%">
            <FlatList
              stickyHeaderHiddenOnScroll={props.searchable}
              stickyHeaderIndices={props.searchable ? [0] : undefined}
              ListHeaderComponent={
                props.searchable ? (
                  <YStack padding={8} bg="white" borderBottomColor="$textOutline" borderBottomWidth={1}>
                    <Input
                      ref={queryInputRef}
                      size="sm"
                      color="gray"
                      onChangeText={setQuery}
                      placeholder={searchableOptions?.placeholder ?? 'Rechercher'}
                      iconRight={searchableIcon}
                      loading={searchableOptions?.isFetching}
                    />
                  </YStack>
                ) : null
              }
              data={filteredItems}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                props.searchable && searchableOptions?.isFetching === false && filteredItems.length === 0 && query.trim() !== '' ? (
                  <DropdownItemFrame>
                    <Text.SM color="$textSecondary">{searchableOptions?.noResults ?? 'Aucun résultat trouvé'}</Text.SM>
                  </DropdownItemFrame>
                ) : null
              }
              renderItem={({ item, index }) => (
                <MemoItem
                  {...item}
                  onPress={handleSelect(item)}
                  size={props.size ?? 'lg'}
                  selected={item.id === props.value}
                  last={filteredItems.length - 1 === index}
                />
              )}
            />
          </DropdownFrame>
        </Animated.View>
      </ModalDropDown>
    </>
  )
})

export default SelectDropdown
