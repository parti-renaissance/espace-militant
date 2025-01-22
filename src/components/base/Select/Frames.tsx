import { NamedExoticComponent } from 'react'
import Text from '@/components/base/Text'
import { IconProps } from '@tamagui/helpers-icon'
import { ChevronsUpDown, XCircle } from '@tamagui/lucide-icons'
import { GestureReponderEvent } from '@tamagui/web'
import { createStyledContext, styled, useGetThemedIcon, withStaticProperties, XStack, XStackProps } from 'tamagui'

export const SelectContext = createStyledContext<{
  themedText: boolean
}>({
  themedText: false,
})

const SelectFrame = styled(XStack, {
  context: SelectContext,
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

const SelectChevron = styled(ChevronsUpDown, {
  context: SelectContext,
  size: 20,
  variants: {
    themedText: {
      true: {
        //@ts-expect-error miss type for tamagui lucide icons, but it's valid
        color: '$color4',
      },
      false: {
        //@ts-expect-error miss type for tamagui lucide icons, but it's valid
        color: '$textSecondary',
      },
    },
  } as const,
})

const SelectResetIcon = styled(XCircle, {
  context: SelectContext,
  size: 20,
  variants: {
    themedText: {
      true: {
        //@ts-expect-error miss type for tamagui lucide icons, but it's valid
        color: '$color9',
      },
      false: {
        //@ts-expect-error miss type for tamagui lucide icons, but it's valid
        color: '$blue9',
      },
    },
  } as const,
})

const SelectFrameContainer = XStack.styleable<
  XStackProps & {
    resetable?: boolean
    onResetPress?: (e: GestureReponderEvent) => void
  }
>(({ resetable, onResetPress, ...props }, ref) => {
  return (
    <XStack gap="$small" alignItems="center" flex={1} ref={ref}>
      <XStack flexShrink={1} flexWrap="wrap" flex={1} {...props} alignItems="center" gap="$xsmall">
        {props.children}
      </XStack>
      <XStack onPress={resetable ? onResetPress : undefined}>{resetable ? <SelectResetIcon /> : <SelectChevron />}</XStack>
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

export const SelectTextValue = styled(Text.MD, {
  context: SelectContext,
  numberOfLines: 1,
  variants: {
    themedText: {
      true: {
        color: '$color6',
      },
      false: {
        color: '$textPrimary',
      },
    },
  } as const,
})

const SelectIconValue = ({ icon, themedText }: { icon: NamedExoticComponent<IconProps>; themedText?: Boolean }) => {
  const ctx = SelectContext.useStyledContext()
  const isThemed = ctx.themedText || themedText
  const getIcon = useGetThemedIcon({ color: isThemed ? '$color6' : '$textPrimary', size: 14 })
  return getIcon(icon)
}

const SelectValueContainer = styled(XStack, { gap: '$xsmall', flexShrink: 1, alignItems: 'center', alignSelf: 'flex-end' })

export const SelectFrames = withStaticProperties(SelectFrame, {
  Props: SelectContext.Provider,
  Container: SelectFrameContainer,
  Label: SelectLabel,
  Text: SelectTextValue,
  Icon: SelectIconValue,
  ValueContainer: SelectValueContainer,
})
