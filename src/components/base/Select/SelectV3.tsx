import React, { ComponentRef, useCallback, useMemo, useRef } from 'react'
import { GestureResponderEvent, Platform, TouchableOpacity } from 'react-native'
import { isWeb, useMedia, XStack, YStack } from 'tamagui'
import { Equal, EqualNot } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'

import { SelectFrames as SF } from './Frames'
import SelectBottomSheet from './SelectBottomSheet'
import SelectDropdown, { SelectDropdownRef } from './SelectDropdown'
import { ModalDropDownRef, SelectOption, SelectProps } from './types'

export { SelectOption, SF }

const Select = <A extends string>(props: SelectProps<A>) => {
  const media = useMedia()
  const frameRef = useRef<ComponentRef<typeof TouchableOpacity> | null>(null)
  const modalRef = useRef<SelectDropdownRef>(null)
  const bottomSheetRef = useRef<ModalDropDownRef>(null)

  const handlePress = useCallback(() => {
    if (props.disabled) return
    modalRef.current?.open()
    bottomSheetRef.current?.open()
  }, [props.disabled, props.searchable, props.options.length])

  const isDropdown = useMemo(() => media.gtSm && isWeb, [media.gtSm])
  const handleResetPress = useCallback(
    (e: GestureResponderEvent) => {
      e.stopPropagation()
      //@ts-expect-error type can be undefined if resetable
      props.onChange?.(undefined)
      //@ts-expect-error type can be undefined if resetable
      props.onDetailChange?.(undefined)
    },
    [props.resetable, props.onChange, props.onDetailChange],
  )

  const isInverseSelectionActive = Boolean(props.allowInverseSelection && typeof props.value === 'string' && props.value.startsWith('!'))
  const fullValue = useMemo(() => {
    const exactValue = props.options.find((option) => option.value === props.value)
    if (exactValue) return exactValue
    const rawValue = props.value
    if (typeof rawValue !== 'string' || !rawValue.startsWith('!')) return undefined
    return props.options.find((option) => option.value === (rawValue.slice(1) as A))
  }, [props.options, props.value])

  const parseFullValueLabel = (x: typeof fullValue) => {
    if (!x) return props.noValuePlaceholder ?? '___'
    // Elipsis on android don't handle dashes..., so we replaced it by spaces.
    if (typeof x.label === 'string' && Platform.OS === 'android') {
      return x.label.replaceAll('-', ' ')
    }
    return x.label
  }

  const isFailed = Boolean(props.error)
  const hasLabel = Boolean(props.label || props.placeholder)

  return (
    <YStack gap="$xsmall">
      {isDropdown ? (
        <SelectDropdown ref={modalRef} frameRef={frameRef} {...props} openAbove={props.openAbove} />
      ) : (
        <SelectBottomSheet ref={bottomSheetRef} frameRef={frameRef} {...props} openAbove={props.openAbove} />
      )}

      <SF.Props themedText={props.matchTextWithTheme ?? false}>
        <SF
          theme={props.theme ?? 'gray'}
          white={props.color === 'white'}
          size={props.size ?? 'lg'}
          onPress={handlePress}
          error={isFailed}
          borderColor={isFailed ? '$red500' : '$colorTransparent'}
          focusStyle={isFailed ? { borderColor: '$red500' } : undefined}
          ref={frameRef}
          onLayout={() => {
            modalRef.current?.setModalPosition?.()
          }}
          disabled={props.disabled}
          {...props.frameProps}
        >
          <SF.Container resetable={props.resetable && !!props.value} icon={props.icon} onResetPress={handleResetPress}>
            {hasLabel ? (
              <Text width="fit-content" maxWidth="50%" mr="$medium" numberOfLines={1}>
                <SF.Label numberOfLines={1}>{props.label || props.placeholder}</SF.Label>
              </Text>
            ) : null}
            <SF.ValueContainer theme={fullValue?.theme} {...(hasLabel ? {} : { justifyContent: 'flex-start' })}>
              {props.allowInverseSelection ? isInverseSelectionActive ? <EqualNot size={16} color="$orange5" /> : null : null}
              {fullValue?.icon ? <SF.Icon themedText={Boolean(fullValue?.theme)} icon={fullValue.icon} /> : null}
              <SF.Text themedText={Boolean(fullValue?.theme)} placeholder={!fullValue}>
                {parseFullValueLabel(fullValue)}
              </SF.Text>
            </SF.ValueContainer>
          </SF.Container>
        </SF>
      </SF.Props>
      {props.error ? (
        <XStack gap="$small" alignItems="center" pl="$medium">
          <Text.XSM color="$red500">{props.error}</Text.XSM>
        </XStack>
      ) : null}
    </YStack>
  )
}

export default Select
