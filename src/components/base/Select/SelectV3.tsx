import React, { ComponentRef, useCallback, useMemo, useRef } from 'react'
import { GestureResponderEvent, TouchableOpacity } from 'react-native'
import Text from '@/components/base/Text'
import { isWeb, useMedia, XStack, YStack } from 'tamagui'
import { SelectFrames as SF } from './Frames'
import SelectBottomSheet from './SelectBottomSheet'
import SelectDropdown, { SelectDropdownRef } from './SelectDropdown'
import { ModalDropDownRef, SelectOption, SelectProps } from './types'

export { SelectOption, SF }

const Select = <A extends string>(props: SelectProps<A>) => {
  const media = useMedia()
  const frameRef = useRef<ComponentRef<typeof TouchableOpacity>>(null)
  const modalRef = useRef<SelectDropdownRef>(null)
  const bottomSheetRef = useRef<ModalDropDownRef>(null)
  const handlePress = useCallback(() => {
    if (props.disabled) return
    modalRef.current?.open()
    bottomSheetRef.current?.open()
  }, [props.disabled])

  const Selector = useMemo(() => {
    return media.gtSm && isWeb ? SelectDropdown : SelectBottomSheet
  }, [media])

  const selectorRef = useMemo(() => {
    return media.gtSm ? modalRef : bottomSheetRef
  }, [media])
  const handleResetPress = useCallback(
    (e: GestureResponderEvent) => {
      e.stopPropagation()
      //@ts-expect-error type can be undefined if resetable
      props.onChange?.(undefined)
      //@ts-expect-error type can be undefined if resetable
      props.onDetailChange?.(undefined)
    },
    [props.resetable],
  )

  const fullValue = props.options.find((option) => option.value === props.value)

  return (
    <YStack>
      <Selector ref={selectorRef} frameRef={frameRef} {...props} />

      <SF.Props themedText={props.matchTextWithTheme ?? false}>
        <SF
          theme={props.theme ?? 'gray'}
          white={props.color === 'white'}
          size={props.size ?? 'lg'}
          onPress={handlePress}
          error={Boolean(props.error)}
          ref={frameRef}
          onLayout={() => {
            modalRef.current?.setModalPosition?.()
          }}
          disabled={props.disabled}
          {...props.frameProps}
        >
          <SF.Container resetable={props.resetable} icon={props.icon} onResetPress={handleResetPress}>
            {props.label || props.placeholder ? <SF.Label>{props.label || props.placeholder}</SF.Label> : null}
            <SF.ValueContainer theme={fullValue?.theme}>
              {fullValue?.icon ? <SF.Icon themedText={Boolean(fullValue?.theme)} icon={fullValue.icon} /> : null}
              <SF.Text themedText={Boolean(fullValue?.theme)}>{fullValue ? fullValue.label : (props.noValuePlaceholder ?? '___')}</SF.Text>
            </SF.ValueContainer>
          </SF.Container>
        </SF>
      </SF.Props>
      {props.error ? (
        <XStack paddingHorizontal="$medium" alignSelf="flex-start" pt="$xsmall">
          <Text.XSM textAlign="right" color="$orange5">
            {props.error}
          </Text.XSM>
        </XStack>
      ) : null}
    </YStack>
  )
}

export default Select
