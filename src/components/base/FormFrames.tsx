import Text from '@/components/base/Text'
import { styled, ThemeableStack, withStaticProperties, XStack } from 'tamagui'

export const FormFrameBase = styled(XStack, {
  theme: 'gray',
  gap: '$small',
  paddingHorizontal: '$medium',
  borderWidth: 2,
  borderColor: '$colorTransparent',

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
        disabledStyle: {
          backgroundColor: '$white1',
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      false: {
        backgroundColor: '$color1',
        disabledStyle: {
          backgroundColor: '$color1',
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
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

export const FormFrameButton = styled(ThemeableStack, {
  tag: 'button',
  height: 36,
  focusable: true,
  paddingVertical: 4,
  paddingHorizontal: 8,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
  cursor: 'pointer',

  variants: {
    themed: {
      true: {
        backgroundColor: '$color2',
        hoverStyle: {
          backgroundColor: '$color3',
        },
        pressStyle: {
          backgroundColor: '$color4',
        },
      },
      false: {
        backgroundColor: '$textOutline',
        hoverStyle: {
          backgroundColor: '$textOutline20',
        },
        pressStyle: {
          backgroundColor: '$textOutline32',
        },
      },
    },
  } as const,
  defaultVariants: {
    themed: false,
  },
})

export const FormFrameLabel = styled(Text.MD, {
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
  defaultVariants: {
    themedText: false,
  },
})

export const FormFrame = withStaticProperties(FormFrameBase, {
  Button: FormFrameButton,
  Label: FormFrameLabel,
})
