import { forwardRef, useEffect, useState } from 'react'
import { GestureResponderEvent, LayoutChangeEvent, NativeSyntheticEvent, Platform, TextInput, TextInputFocusEventData, TextInputProps } from 'react-native'
import Text from '@/components/base/Text'
import { useForwardRef } from '@/hooks/useForwardRef'
import { AlertCircle } from '@tamagui/lucide-icons'
import { AnimatePresence, isWeb, Spinner, styled, TamaguiElement, useTheme, XStack, YStack } from 'tamagui'

export type InputProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'white' | 'gray'
  error?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  onChange?: (text: string) => void
  onIconRightPress?: (e: GestureResponderEvent) => void
  frameRef?: React.RefObject<TamaguiElement>
  type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'time'
  fake?: boolean
} & Omit<TextInputProps, 'placeholder' | 'onChange'>

const sizes = {
  xs: {
    height: 3.5,
  },
  sm: {
    height: 4,
  },
  md: {
    height: 4.5,
  },
  lg: {
    height: 5,
  },
}

const InputFrame = styled(XStack, {
  name: 'Input',
  gap: '$small',
  width: '100%',
  minWidth: 100,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '$10',
  paddingHorizontal: '$medium',
  borderWidth: 2,
  borderColor: '$colorTransparent',
  animation: 'bouncy',
  hoverStyle: {
    backgroundColor: 'rgba(237, 239, 242, 1)',
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
    multiline: {
      true: {
        alignItems: 'flex-start',
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
    },
  },
})

export default forwardRef<TextInput, InputProps>(function Input(_props, ref) {
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

  const calcSize = sizes[size ?? 'lg'].height
  const theme = useTheme()

  return (
    <YStack gap="$xsmall" flex={1} ref={frameRef}>
      <InputFrame
        disabled={disabled}
        color={color ?? 'white'}
        error={isFailed}
        forceStyle={isFocused ? 'focus' : undefined}
        onPress={handlePress}
        minHeight={`$${inputProps.multiline ? Math.round(calcSize + 4) : calcSize}`}
      >
        {!loading && iconLeft && (
          <YStack height="100%" justifyContent="center">
            {iconLeft}
          </YStack>
        )}
        <YStack
          gap="$xsmall"
          height="100%"
          flex={1}
          justifyContent={inputProps.multiline ? undefined : 'center'}
          paddingTop={inputProps.multiline ? '$medium' : 'xsmall'}
          paddingBottom="$xsmall"
        >
          <AnimatePresence>
            {(label || (placeholder && inputProps.value && inputProps.value.length > 0)) && (
              <XStack alignSelf="flex-start" width="100%">
                <Text.SM flex={1} color={error ? '$orange7' : '$textPrimary'} numberOfLines={1}>
                  {label ?? placeholder}
                </Text.SM>
              </XStack>
            )}
          </AnimatePresence>
          {fake ? (
            <Text.MD color={inputProps.value ? '$textPrimary' : '$textSecondary'} semibold={!!inputProps.value} numberOfLines={1} borderBottomWidth={0}>
              {inputProps.value || placeholder}
            </Text.MD>
          ) : (
            <TextInput
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
        {!loading && iconRight && (
          <YStack height="100%" justifyContent="center" onPress={onIconRightPress}>
            {iconRight}
          </YStack>
        )}
        {loading && <Spinner color="$blue7" />}
      </InputFrame>
      {error && (
        <XStack gap="$small" alignItems="center" pl="$medium">
          <AlertCircle color="$orange7" size={12} />
          <Text.SM color="$orange7">{error}</Text.SM>
        </XStack>
      )}
    </YStack>
  )
})
