import Text from '@/components/base/Text'
import { Input, styled, ThemeableStack, withStaticProperties, XStack } from 'tamagui'

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

export const FormFrameInput = styled(Input, {
  tag: 'input',
  height: 36,
  width: 'auto',
  unstyled: true,
  focusable: true,
  paddingVertical: 4,
  paddingHorizontal: 8,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
  cursor: 'pointer',

  variants: {
    error: {
      true: {
        color: '$orange5',
        backgroundColor: '$orange1',
        focusStyle: {
          borderColor: '$orange1',
        },
      },
    },
    themed: {
      true: {
        color: '$color5',
        backgroundColor: '$color2',
        hoverStyle: {
          backgroundColor: '$color3',
        },
        pressStyle: {
          backgroundColor: '$color4',
        },
      },
      false: {
        color: '$textPrimary',
        backgroundColor: '$textOutline20',
        hoverStyle: {
          backgroundColor: '$gray2',
        },
        pressStyle: {
          backgroundColor: '$gray3',
        },
      },
    },
  } as const,
  defaultVariants: {
    themed: false,
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
    error: {
      true: {
        backgroundColor: '$orange1',
        focusStyle: {
          borderColor: '$orange1',
        },
      },
    },
    themed: {
      true: {
        backgroundColor: '$color2',
        hoverStyle: {
          backgroundColor: '$color',
        },
        pressStyle: {
          backgroundColor: '$color4',
        },
      },
      false: {
        backgroundColor: '$textOutline20',
        hoverStyle: {
          backgroundColor: '$gray2',
        },
        pressStyle: {
          backgroundColor: '$gray3',
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
  Input: FormFrameInput,
  Label: FormFrameLabel,
})
