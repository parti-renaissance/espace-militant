import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'
import { createStyledContext, styled } from '@tamagui/core'
import { Check } from '@tamagui/lucide-icons'
import { ThemeableStack } from '@tamagui/stacks'

export const CheckboxContext = createStyledContext({
  checked: false,
  disabled: false,
})

export const CheckboxGroupZone = styled(ThemeableStack, {
  tag: 'button',
  context: CheckboxContext,
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

export const CheckboxGroupItemFrame = styled(ThemeableStack, {
  context: CheckboxContext,
  animation: 'bouncy',
  borderRadius: 2,
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
        borderColor: '$gray7',
      },
    },
  } as const,
})

export const CheckboxGroupIndicatorFrame = styled(ThemeableStack, {
  context: CheckboxContext,
  width: 18,
  height: 18,
  animation: 'bouncy',
  borderColor: 'transparent',
  borderRadius: 2,
  justifyContent: 'center',
  alignItems: 'center',
  scale: 0,
  variants: {
    checked: {
      true: {
        backgroundColor: '$gray7',
        // borderColor: '$gray7',
        scale: 1,
      },
    },
  } as const,
})

export default forwardRef<ComponentRef<typeof CheckboxGroupZone>, ComponentPropsWithoutRef<typeof CheckboxGroupZone> & { color?: 'blue' | 'gray' }>(function (
  { color = 'blue', ...props },
  ref,
) {
  const hintColor = color === 'gray' ? '$gray7' : '$blue9'
  return (
    <CheckboxGroupZone {...props} ref={ref}>
      <CheckboxGroupItemFrame borderColor={props.checked ? hintColor : '$textSecondary'}>
        <CheckboxGroupIndicatorFrame backgroundColor={props.checked ? hintColor : undefined}>
          <Check size={14} color="white1" />
        </CheckboxGroupIndicatorFrame>
      </CheckboxGroupItemFrame>
    </CheckboxGroupZone>
  )
})
