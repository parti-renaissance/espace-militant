import { NamedExoticComponent, ComponentProps } from 'react'
import Text from '@/components/base/Text'
import { IconProps } from '@tamagui/helpers-icon'
import { ChevronsUpDown, X } from '@tamagui/lucide-icons'
import { GestureReponderEvent } from '@tamagui/web'
import { createStyledContext, styled, useGetThemedIcon, View, withStaticProperties, XStack, XStackProps } from 'tamagui'
import { VoxButton } from '@/components/Button/Button'

export const SelectContext = createStyledContext<{
  themedText: boolean
}>({
  themedText: false,
})

const SelectFrame = styled(XStack, {
  context: SelectContext,
  tag: 'button',
  theme: 'gray',
  gap: '$small',
  focusable: true,
  alignItems: 'center',
  paddingHorizontal: '$medium',
  borderWidth: 2,
  borderColor: '$colorTransparent',
  animation: 'quickest',
  cursor: 'pointer',

  variants: {
    error: {
      true: {
        backgroundColor: '$orange1',
        focusStyle: {
          borderColor: '$orange1',
        },
      },
    },
    white: {
      true: {
        backgroundColor: '$white0',
        hoverStyle: {
          backgroundColor: '$color1',
        },
        pressStyle: {
          backgroundColor: '$color2',
        },
        focusStyle: {
          borderColor: '$color9',
        },
        disabledStyle: {
          backgroundColor: '$white1',
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      false: {
        backgroundColor: '$color1',
        hoverStyle: {
          backgroundColor: '$color2',
        },
        pressStyle: {
          backgroundColor: '$color3',
        },
        focusStyle: {
          borderColor: '$color9',
        },
        disabledStyle: {
          backgroundColor: '$color1',
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
    },
    themedText: {
      true: {},
      false: {},
    },
    size: {
      xs: {
        height: 40,
        borderRadius: 20,
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
      },
    },
  } as const,
  defaultVariants: {
    size: 'sm',
    white: false,
  },
})

const SelectIconContainer = ({ icon, themedText }: { icon: NamedExoticComponent<IconProps>; themedText?: boolean }) => {
  const ctx = SelectContext.useStyledContext()
  const isThemed = ctx.themedText || themedText
  const getIcon = useGetThemedIcon({ color: isThemed ? '$color4' : '$gray4', size: 20, })
  return getIcon(icon)
}

const SelectFrameContainer = XStack.styleable<
  XStackProps & {
    resetable?: boolean
    icon?: NamedExoticComponent<IconProps>
    onResetPress?: (e: GestureReponderEvent) => void
  }
>(({ resetable, onResetPress, icon, ...props }, ref) => {
  const defIcon = <SelectIconContainer icon={icon ?? ChevronsUpDown} />
  return (
    <XStack gap="$small" alignItems="center" flex={1} ref={ref}>
      <XStack flexShrink={1} flex={1} {...props} alignItems="center" gap="$small" margin="auto">
        {props.children}
      </XStack>
      <XStack onPress={resetable ? onResetPress : undefined}>
        {resetable ? (
          <VoxButton
            size="md"
            variant="text"
            onPress={onResetPress}
            iconSize={20}
            shrink
            iconLeft={X}
            textColor="$gray5"
            theme="gray"
          />
        ) : (
          defIcon
        )}
      </XStack>
    </XStack>
  )
})

const SelectLabel = styled(Text.MD, {
  context: SelectContext,
  flexGrow: 1,
  variants: {
    themedText: {
      true: {
        color: '$color4',
      },
      false: {
        color: '$textSecondary',
      },
    },
  } as const,
})

export const SelectTextValue = ({ children, themedText, placeholder, ...props }: ComponentProps<typeof Text.MD> & { themedText?: boolean, placeholder?: boolean }) => {
  const ctx = SelectContext.useStyledContext()
  const isThemed = themedText ?? ctx.themedText
  
  let color: string
  
  if (isThemed) {
    color = placeholder ? '$color4' : '$color6'
  } else {
    color = placeholder ? '$gray4' : '$textPrimary'
  }
  
  return (
    <Text.MD 
      numberOfLines={1} 
      color={color}
      fontWeight={placeholder ? '400' : '500'}
      {...props}
    >
      {children}
    </Text.MD>
  )
}

const SelectIconValue = ({ icon, themedText }: { icon: NamedExoticComponent<IconProps>; themedText?: boolean }) => {
  const ctx = SelectContext.useStyledContext()
  const isThemed = ctx.themedText || themedText
  const getIcon = useGetThemedIcon({ color: isThemed ? '$color6' : '$textPrimary', size: 14 })
  return (
    <View width={16}>
      {getIcon(icon)}
    </View>
  )
}

const SelectValueContainer = styled(XStack, { gap: '$xsmall', alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'flex-end', marginVertical: 'auto', flex: 1, minWidth: 50 })

export const SelectFrames = withStaticProperties(SelectFrame, {
  Props: SelectContext.Provider,
  Container: SelectFrameContainer,
  Label: SelectLabel,
  Text: SelectTextValue,
  Icon: SelectIconValue,
  ValueContainer: SelectValueContainer,
})
