import { ComponentProps, ComponentRef, createContext, forwardRef, useContext, useEffect, useMemo, useState } from 'react'
import { GestureResponderEvent, LayoutChangeEvent, NativeSyntheticEvent, Platform, TextInput, TextInputFocusEventData, TextInputProps } from 'react-native'
import { AnimatePresence, isWeb, Spinner, styled, TamaguiElement, useTheme, XStack, YStack } from 'tamagui'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'

import Text from '@/components/base/Text'

import { useForwardRef } from '@/hooks/useForwardRef'

const KEYBOARD_BREATHING_SPACE = 24

const BottomSheetContext = createContext<boolean>(false)

export const BottomSheetProvider = ({ children }: { children: React.ReactNode }) => {
  return <BottomSheetContext.Provider value={true}>{children}</BottomSheetContext.Provider>
}

// Hook pour vérifier si on est dans un vrai BottomSheet
function useIsInBottomSheet(): boolean {
  return useContext(BottomSheetContext)
}

export type InputProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'white' | 'gray' | 'pink'
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
  /** Remplit la hauteur du conteneur parent (multiline uniquement). */
  fill?: boolean
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
        focusVisibleStyle: {
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
      pink: {
        backgroundColor: '$white1',
        hoverStyle: {
          backgroundColor: '$pink3',
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
        minWidth: 0,
      },
    },
    withoutLabel: {
      true: {
        justifyContent: 'center',
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
    multiline,
    fill,
    numberOfLines: _numberOfLines,
    ...textInputProps
  } = _props
  const [isFocused, setIsFocused] = useState(false)
  const [errorLayoutHeight, setErrorLayoutHeight] = useState(0)
  const inputRef = useForwardRef(ref)
  const isFailed = !!error
  const hasLabel = !!label && label !== ''

  const shouldApplyBreathing = !isWeb && !fake
  const breathingSpace = shouldApplyBreathing ? KEYBOARD_BREATHING_SPACE + (isFailed ? errorLayoutHeight : 0) : 0
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
    if (multiline && isWeb && !fill) adjustTextInputSize(evt)
  }

  const handleLayoutChange = (evt: LayoutChangeEvent) => {
    if (multiline && isWeb && !fill) adjustTextInputSize(evt)
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
    textInputProps.onPress?.(e)
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
    color: textInputProps.value ? (color !== 'pink' ? '$textPrimary' : '$pink6') : '$textSecondary',
    semibold: !!textInputProps.value,
    numberOfLines: fakeProps?.multiline ? undefined : 1,
    borderBottomWidth: 0,
    children: textInputProps.value || placeholder,
  }

  const FakeTextComponent = fakeProps?.customTextComponent ?? Text.MD
  const isInBottomSheet = useIsInBottomSheet()
  // Utiliser BottomSheetTextInput seulement si bottomSheetInput est true ET qu'on est dans un vrai BottomSheet
  const DynInput = useMemo(() => (bottomSheetInput && isInBottomSheet ? BottomSheetTextInput : TextInput), [bottomSheetInput, isInBottomSheet])

  return (
    <YStack gap="$xsmall" ref={frameRef} flex={fill ? 1 : undefined} height={fill ? '100%' : undefined} minHeight={fill ? 0 : undefined}>
      <InputFrame
        disabled={disabled}
        color={color ?? 'white'}
        error={isFailed}
        fake={fake}
        multiline={multiline}
        flex={fill ? 1 : undefined}
        height={fill ? '100%' : undefined}
        minHeight={fill ? 0 : undefined}
        size={multiline ? undefined : (size ?? 'lg')}
        forceStyle={isFocused ? 'focus' : undefined}
        onPress={handlePress}
        withoutLabel={!hasLabel}
      >
        {!loading && iconLeft && (
          <YStack height="100%" justifyContent="center">
            {iconLeft}
          </YStack>
        )}
        <YStack flex={1} height={fill ? '100%' : 'auto'} minWidth={0} minHeight={fill ? 0 : undefined} paddingTop={multiline ? '$medium' : 0}>
          <AnimatePresence>
            {hasLabel &&
              (label ||
                (placeholder && textInputProps.value && textInputProps.value.length > 0) ||
                (placeholder && textInputProps.defaultValue && textInputProps.defaultValue.length > 0)) && (
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
                paddingBottom: breathingSpace,
                marginBottom: -breathingSpace,
                fontSize: 14,
                height:
                  fill && multiline
                    ? '100%'
                    : Platform.OS === 'android' && !multiline
                      ? 18 + breathingSpace
                      : 'auto',
                flex: fill && multiline ? 1 : undefined,
                width: '100%',
                minWidth: 0,
                fontWeight: isWeb ? (textInputProps.value ? 500 : 400) : undefined,
                ...(multiline && isWeb
                  ? {
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                      resize: 'none',
                      overflowY: 'auto',
                      ...(fill ? {} : { maxHeight: 200 }),
                    }
                  : {}),
              }}
              editable={!disabled}
              ref={inputRef}
              multiline={multiline}
              value={textInputProps.value}
              onChangeText={handleValueChange}
              placeholderTextColor={theme.textDisabled.val}
              placeholder={placeholder}
              textAlignVertical={multiline || (shouldApplyBreathing && Platform.OS === 'android') ? 'top' : 'center'}
              numberOfLines={multiline ? undefined : 1}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...textInputProps}
              onChange={handleChange}
              onLayout={handleLayoutChange}
              onPress={disabled ? undefined : textInputProps.onPress}
            />
          )}
        </YStack>
        {!loading && iconRight ? <XStack onPress={onIconRightPress}>{iconRight}</XStack> : null}

        {loading ? <Spinner color="$blue7" /> : null}
      </InputFrame>
      {error && (
        <XStack
          gap="$small"
          alignItems="center"
          pl="$medium"
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height
            if (h && h !== errorLayoutHeight) setErrorLayoutHeight(h)
          }}
        >
          <Text.XSM color="$orange5">{error}</Text.XSM>
        </XStack>
      )}
    </YStack>
  )
})
