import { forwardRef, NamedExoticComponent } from 'react'
import Text from '@/components/base/Text'
import type { IconProps } from '@tamagui/helpers-icon'
import { createStyledContext, Spinner, styled, TamaguiElement, View, withStaticProperties } from 'tamagui'

export const ButtonContext = createStyledContext({
  pop: false,
  disabled: false,
  loading: false,
  asChip: false,
  // 'data-testid': 'Button',
})

export const ButtonFrameStyled = styled(View, {
  context: ButtonContext,
  animation: 'quick',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  alignSelf: 'flex-start',
  gap: 6,
  paddingHorizontal: '$medium',
  borderRadius: '$12',
  cursor: 'pointer',
  borderWidth: 1.2,
  borderColor: 'transparent',
  backgroundColor: '$background',
  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },
  pressStyle: {
    backgroundColor: '$backgroundPress',
  },

  disabledStyle: {
    opacity: 0.3,
    cursor: 'not-allowed',
    backgroundColor: '$background',
  },

  variants: {
    full: {
      true: {
        width: '100%',
        flex: 1,
      },
    },
    shrink: {
      true: {
        paddingHorizontal: 0,
      },
    },
    pop: {
      true: {},
    },
    loading: {
      true: {
        pointerEvents: 'none',
        cursor: 'wait',
      },
    },
    asChip: {
      true: {
        cursor: 'default',
        hoverStyle: {
          backgroundColor: '$background',
        },
        pressStyle: {
          backgroundColor: '$background',
        },
      },
    },
    size: {
      sm: {
        height: 32,
        minWidth: 32,
        gap: 4,
      },
      md: {
        height: 36,
        minWidth: 36,
        gap: 6,
      },
      lg: {
        height: 40,
        minWidth: 40,
        gap: 8,
      },
      xl: {
        height: 44,
        minWidth: 44,
        gap: 10,
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    asChip: false,
  },
})

const ContainedFrame = styled(ButtonFrameStyled, {
  name: 'VoxButtonContained',
})

const InverseContainedFrame = styled(ButtonFrameStyled, {
  name: 'VoxButtonInverseContained',
})

const InverseSoftFrame = styled(ButtonFrameStyled, {
  name: 'VoxButtonInverseSoft',
})

const OutlinedFrame = styled(ButtonFrameStyled, {
  name: 'VoxButtonOutlined',
  borderColor: '$borderColor',
  hoverStyle: {
    borderColor: '$borderColorHover',
    backgroundColor: '$backgroundHover',
  },
})

const TextFrame = styled(ButtonFrameStyled, {
  name: 'VoxButtonText',
})

const SoftFrame = styled(ButtonFrameStyled, {
  name: 'VoxButtonSoft',
})

const getFrame = (variant?: 'outlined' | 'text' | 'soft' | 'contained', inverse?: boolean) => {
  switch (variant) {
    case 'outlined':
      return OutlinedFrame
    case 'text':
      return TextFrame
    case 'soft':
      return inverse ? InverseSoftFrame : SoftFrame
    case 'contained':
    default:
      return inverse ? InverseContainedFrame : ContainedFrame
  }
}

const ButtonFrame = forwardRef<
  TamaguiElement,
  React.ComponentPropsWithoutRef<typeof ButtonFrameStyled> & { variant?: 'outlined' | 'text' | 'soft' | 'contained'; inverse?: boolean }
>(({ variant, inverse, ...props }, ref) => {
  const Frame = getFrame(props.asChip ? 'text' : variant, inverse)
  const outlinedException =
    variant === 'outlined' && (props.theme === 'gray' || !props.theme)
      ? {
          borderColor: '$textOutline32',
        }
      : {}

  return <Frame ref={ref} {...props} {...outlinedException} />
})

const ButtonSpinner = styled(Spinner, {
  color: '$color',
})

export const ButtonText = styled(Text.MD, {
  context: ButtonContext,
  color: '$color',
  userSelect: 'none',
  semibold: true,

  '$group-hover': {
    color: '$colorHover',
  },
  '$group-press': {
    color: '$colorPress',
  },

  variants: {
    pop: {
      true: {
        color: '$colorPop',
      },
    },
    asChip: {
      true: {
        '$group-hover': {
          color: '$color',
        },
        '$group-press': {
          color: '$color',
        },
      },
    },
  } as const,
})

const Button = withStaticProperties(ButtonFrame, {
  Props: ButtonContext.Provider,
  Text: ButtonText,
})

export default Button

export type VoxButtonProps = {
  iconLeft?: NamedExoticComponent<IconProps>
  iconRight?: NamedExoticComponent<IconProps>
  textColor?: string
  loading?: boolean
  children?: string[] | string
} & React.ComponentProps<typeof Button>

export const VoxButton = forwardRef<TamaguiElement, VoxButtonProps>(
  ({ children: child, shrink, iconLeft: IconLeft, iconRight: IconRight, onPress, textColor, ...props }, ref) => {
    const children = shrink ? undefined : child
    const fnOnPress = props.asChip ? undefined : onPress

    const customTextProps = textColor ? { color: textColor } : {}

    return (
      <Button {...props} onPress={fnOnPress} shrink={shrink} ref={ref} theme={props.theme ?? 'gray'} group>
        {IconLeft ? (
          <IconLeft
            size={16}
            color={textColor ?? (props.pop ? '$colorPop' : '$color')}
            $group-hover={{
              color: '$colorHover',
            }}
            $group-press={{
              color: '$colorPress',
            }}
          />
        ) : null}
        {children ? (
          <ButtonText {...customTextProps} pop={props.pop}>
            {children}
          </ButtonText>
        ) : null}
        {IconRight ? (
          <IconRight
            size={16}
            color={textColor ?? (props.pop ? '$colorPop' : '$color')}
            $group-hover={{
              color: '$colorHover',
            }}
            $group-press={{
              color: '$colorPress',
            }}
          />
        ) : null}
        {props.loading && <ButtonSpinner size="small" />}
      </Button>
    )
  },
)
