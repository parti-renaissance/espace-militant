import React, { useCallback, useMemo, useRef } from 'react'
import { Pressable, TouchableOpacity } from 'react-native'
import { ChevronsUpDown, XCircle } from '@tamagui/lucide-icons'
import { useMedia } from 'tamagui'
import Input from '../Input/Input'
import SelectBottomSheet from './SelectBottomSheet'
import SelectDropdown, { SelectDropdownRef } from './SelectDropdown'
import { ModalDropDownRef, SelectProps } from './types'

const Select = <A extends string>(props: SelectProps<A>) => {
  const media = useMedia()
  const frameRef = useRef<TouchableOpacity>(null)
  const modalRef = useRef<SelectDropdownRef>(null)
  const bottomSheetRef = useRef<ModalDropDownRef>(null)
  const handlePress = useCallback(() => {
    if (props.disabled) return
    modalRef.current?.open()
    bottomSheetRef.current?.open()
  }, [props.disabled])

  const Selector = useMemo(() => {
    return media.gtSm ? SelectDropdown : SelectBottomSheet
  }, [media])

  const selectorRef = useMemo(() => {
    return media.gtSm ? modalRef : bottomSheetRef
  }, [media])
  const IconRight = useCallback(() => {
    return props.resetable ? (
      <Pressable
        onPress={(e) => {
          e.stopPropagation()
          // @ts-ignore
          props.onChange?.(undefined)
          // @ts-ignore
          props.onDetailChange?.(undefined)
        }}
      >
        <XCircle color="$blue9" />
      </Pressable>
    ) : (
      <ChevronsUpDown color="$textPrimary" />
    )
  }, [props.resetable])
  return (
    <>
      <Selector ref={selectorRef} frameRef={frameRef} {...props} />
      <TouchableOpacity
        activeOpacity={props.disabled ? 1 : 0.2}
        onPress={handlePress}
        ref={frameRef}
        onLayout={() => {
          modalRef.current?.setModalPosition?.()
        }}
      >
        <Input
          color={props.color ?? 'gray'}
          size={props.size}
          onPress={handlePress}
          fake
          placeholder={props.placeholder}
          label={props.label}
          error={props.error}
          disabled={props.disabled}
          value={props.options.find((option) => option.value === props.value)?.label}
          iconRight={<IconRight />}
        />
      </TouchableOpacity>
    </>
  )
}

export default Select
