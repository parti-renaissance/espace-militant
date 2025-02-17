import { ComponentProps, ComponentRef, forwardRef, useEffect, useMemo, useState } from 'react'
import { GestureResponderEvent, LayoutChangeEvent, NativeSyntheticEvent, TextInput, TextInputFocusEventData, TextInputProps } from 'react-native'
import Text from '@/components/base/Text'
import { useForwardRef } from '@/hooks/useForwardRef'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { AnimatePresence, isWeb, Spinner, styled, TamaguiElement, useTheme, XStack, YStack } from 'tamagui'

export type InputProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'white' | 'gray' | 'purple'
  error?: string
  label?: string
  placeholder?: string
  bottomSheetInput?: boolean
  disabled?: boolean
  loading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  onChange?: (text: string) => void
  onIconRightPress?: (e: GestureResponderEvent) => void
  frameRef?: React.RefObject<TamaguiElement>
  type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'time'
  fake?: boolean
  fakeProps?: {
    multiline?: boolean
    customTextComponent?: (props: ComponentProps<typeof Text>) => React.ReactNode
  }
} & Omit<TextInputProps, 'placeholder' | 'onChange'>

const InputFrame = styled(XStack, {
  name: 'Input',
  gap: '$small',
  width: '100%',
  minWidth: 100,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 22,
  paddingHorizontal: '$medium',
  borderWidth: 2,
  borderColor: '$colorTransparent',
  animation: 'bouncy',
  hoverStyle: {
    backgroundColor: '$gray2',
    cursor: 'text',
  },
  focusStyle: {
    borderColor: '$blue9',
  },

  disabledStyle: {
    backgroundColor: '$gray1',
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  variants: {
    fake: {
      true: {
        hoverStyle: {
          cursor: 'pointer',
        },
      },
    },
    error: {
      true: {
        backgroundColor: '$orange1',
        focusStyle: {
          borderColor: '$orange1',
        },
      },
    },
    color: {
      white: {
        backgroundColor: '$white1',
      },
      gray: {
        backgroundColor: '$gray1',
      },
      purple: {
        backgroundColor: '$white1',
        hoverStyle: {
          backgroundColor: '$purple3',
          cursor: 'text',
        },
      },
    },
    size: {
      xs: {
        borderRadius: 20,
        height: 40,
      },
      sm: {
        height: 44,
        borderRadius: 22,
      },
      md: {
        height: 48,
        borderRadius: 24,
      },
      lg: {
        height: 56,
        borderRadius: 28,
      },
      xl: {
        height: 56,
        borderRadius: 28,
        paddingVertical: '$xsmall',
        paddingHorizontal: '$large',
      },
    },
    multiline: {
      true: {
        alignItems: 'flex-start',
        height: 'auto',
        minHeight: 56 + 40,
        borderRadius: 28,
      },
    },
  } as const,
})

export default forwardRef<ComponentRef<typeof BottomSheetTextInput>, InputProps>(function Input(_props, ref) {
  const {
    size,
    color,
    error,
    label,
    placeholder,
    disabled,
    loading,
    iconLeft,
    iconRight,
    type,
    fake,
    onFocus,
    onBlur,
    onChangeText,
    onIconRightPress,
    onChange,
    frameRef,
    fakeProps,
    bottomSheetInput,
    ...inputProps
  } = _props
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useForwardRef(ref)
  const isFailed = !!error
  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true)
    onFocus?.(e)
  }
  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const handleValueChange = (text: string) => {
    onChangeText?.(text)
    onChange?.(text)
  }

  const handleChange = (evt: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (inputProps.multiline && isWeb) adjustTextInputSize(evt)
  }

  const handleLayoutChange = (evt: LayoutChangeEvent) => {
    if (inputProps.multiline && isWeb) adjustTextInputSize(evt)
  }

  const adjustTextInputSize = (evt) => {
    if (!isWeb) return
    const el = evt?.target || evt?.nativeEvent?.target
    if (el) {
      const lastHeight = el.style.height
      el.style.height = 0

      const newHeight = el.offsetHeight - el.clientHeight + el.scrollHeight

      if (newHeight < 200) {
        el.style.height = `${newHeight}px`
      } else {
        el.style.height = lastHeight
      }
    }
  }

  const handlePress = (e) => {
    if (disabled) {
      if (isWeb) e.preventDefault()
      return
    }
    inputProps.onPress?.(e)
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (inputRef.current && type && isWeb) {
      // @ts-expect-error wrong type on input
      inputRef.current.type = type
    }
  }, [type])

  const theme = useTheme()

  const defaultFakeTextProps = {
    color: inputProps.value ? (color !== 'purple' ? '$textPrimary' : '$purple6') : '$textSecondary',
    semibold: !!inputProps.value,
    numberOfLines: fakeProps?.multiline ? undefined : 1,
    borderBottomWidth: 0,
    children: inputProps.value || placeholder,
  }

  const FakeTextComponent = fakeProps?.customTextComponent ?? Text.MD
  const DynInput = useMemo(() => (bottomSheetInput ? BottomSheetTextInput : TextInput), [])

  return (
    <YStack gap="$xsmall" flex={1} ref={frameRef}>
      <InputFrame
        disabled={disabled}
        color={color ?? 'white'}
        error={isFailed}
        fake={fake}
        multiline={inputProps.multiline}
        size={inputProps.multiline ? undefined : (size ?? 'lg')}
        forceStyle={isFocused ? 'focus' : undefined}
        onPress={handlePress}
      >
        {!loading && iconLeft && (
          <YStack height="100%" justifyContent="center">
            {iconLeft}
          </YStack>
        )}
        <YStack height="auto" flex={1} paddingTop={inputProps.multiline ? '$medium' : 0}>
          <AnimatePresence>
            {(label ||
              (placeholder && inputProps.value && inputProps.value.length > 0) ||
              (placeholder && inputProps.defaultValue && inputProps.defaultValue.length > 0)) && (
              <XStack alignSelf="flex-start" width="100%">
                <Text.XSM flex={1} color={error ? '$orange5' : '$textPrimary'} numberOfLines={1}>
                  {label ?? placeholder}
                </Text.XSM>
              </XStack>
            )}
          </AnimatePresence>
          {fake ? (
            <FakeTextComponent {...defaultFakeTextProps} />
          ) : (
            <DynInput
              style={{
                color: theme.textPrimary.val,
                padding: 0,
                fontSize: 14,
                width: '100%',
                fontWeight: isWeb ? (inputProps.value ? 500 : 400) : undefined,
              }}
              editable={!disabled}
              ref={inputRef}
              value={inputProps.value}
              onChangeText={handleValueChange}
              placeholderTextColor={theme.textDisabled.val}
              placeholder={placeholder}
              textAlignVertical={inputProps.multiline ? 'top' : 'center'}
              numberOfLines={inputProps.multiline ? undefined : 1}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...inputProps}
              onChange={handleChange}
              onLayout={handleLayoutChange}
              onPress={disabled ? undefined : inputProps.onPress}
            />
          )}
        </YStack>
        {!loading && iconRight ? <XStack onPress={onIconRightPress}>{iconRight}</XStack> : null}

        {loading ? <Spinner color="$blue7" /> : null}
      </InputFrame>
      {error && (
        <XStack gap="$small" alignItems="center" pl="$medium">
          <Text.XSM color="$orange5">{error}</Text.XSM>
        </XStack>
      )}
    </YStack>
  )
})
