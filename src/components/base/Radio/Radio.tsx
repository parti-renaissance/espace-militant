import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'
import { createStyledContext, styled } from '@tamagui/core'
import { ThemeableStack } from '@tamagui/stacks'

export const RadioContext = createStyledContext({
  checked: false,
  disabled: false,
})

export const RadioGroupZone = styled(ThemeableStack, {
  tag: 'button',
  context: RadioContext,
  focusable: true,
  height: 34,
  width: 34,
  borderRadius: 1000,
  group: true,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  animation: 'bouncy',
  // '$group-hover': { backgroundColor: '$blue2' }, // Disabled for Expo 53 compatibility
  focusStyle: {
    backgroundColor: '$blue2',
  },
  hoverStyle: {
    backgroundColor: '$blue2',
  },
  disabledStyle: {
    cursor: 'not-allowed',
    opacity: 0.4,
    backgroundColor: 'transparent',
  },
  variants: {
    checked: {
      true: {},
    },
  } as const,
})

export const RadioGroupItemFrame = styled(ThemeableStack, {
  context: RadioContext,
  borderRadius: 1000,
  animation: 'bouncy',
  height: 18,
  width: 18,
  backgroundColor: 'transparent',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '$textSecondary',
  padding: 0,

  variants: {
    checked: {
      true: {
        borderColor: '$blue9',
      },
    },
  } as const,
})

export const RadioGroupIndicatorFrame = styled(ThemeableStack, {
  context: RadioContext,
  width: 18,
  height: 18,
  borderRadius: 1000,
  animation: 'bouncy',
  borderWidth: 4,
  borderColor: 'transparent',
  scale: 0,
  variants: {
    checked: {
      true: {
        backgroundColor: '$white1',
        borderColor: '$blue9',
        scale: 1,
      },
    },
  } as const,
})

export default forwardRef<ComponentRef<typeof RadioGroupZone>, ComponentPropsWithoutRef<typeof RadioGroupZone>>(function (props, ref) {
  return (
    <RadioGroupZone {...props} ref={ref}>
      <RadioGroupItemFrame>
        <RadioGroupIndicatorFrame />
      </RadioGroupItemFrame>
    </RadioGroupZone>
  )
})
