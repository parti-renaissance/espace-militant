import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'
import { createStyledContext, styled } from '@tamagui/core'
import { ThemeableStack } from '@tamagui/stacks'

export const SwitchContext = createStyledContext({
  checked: false,
  disabled: false,
})

export const SwitchGroupZone = styled(ThemeableStack, {
  tag: 'button',
  context: SwitchContext,
  focusable: true,
  height: 24 + 16,
  width: 40 + 16,
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

export const SwitchGroupItemFrame = styled(ThemeableStack, {
  context: SwitchContext,
  animation: 'bouncy',
  borderRadius: 999,
  height: 24,
  width: 40,
  padding: 2,
  backgroundColor: '$gray3',
  justifyContent: 'center',

  variants: {
    checked: {
      true: {
        backgroundColor: '$blue9',
      },
    },
  } as const,
})

export const SwitchGroupIndicatorFrame = styled(ThemeableStack, {
  context: SwitchContext,
  width: 20,
  height: 20,
  animation: 'bouncy',
  transform: [{ translateX: 0 }],
  borderRadius: 999,
  backgroundColor: '$white1',
  variants: {
    checked: {
      true: {
        transform: [{ translateX: 16 }],
      },
    },
  } as const,
})

export default forwardRef<ComponentRef<typeof SwitchGroupZone>, ComponentPropsWithoutRef<typeof SwitchGroupZone> & { color?: 'blue' | 'gray' }>(function (
  { color = 'blue', ...props },
  ref,
) {
  const hintColor = color === 'gray' ? '$gray7' : '$blue9'
  return (
    <SwitchGroupZone {...props} ref={ref}>
      <SwitchGroupItemFrame borderColor={props.checked ? hintColor : '$gray3'}>
        <SwitchGroupIndicatorFrame />
      </SwitchGroupItemFrame>
    </SwitchGroupZone>
  )
})
