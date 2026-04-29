import React, { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'
import { Stack } from 'tamagui'
import { Check, Minus } from '@tamagui/lucide-icons'

type CheckboxProps = ComponentPropsWithoutRef<typeof Stack> & {
  color?: 'blue' | 'gray'
  indeterminate?: boolean
  checked?: boolean
}

export default forwardRef<ComponentRef<typeof Stack>, CheckboxProps>(function Checkbox(
  { color = 'blue', indeterminate = false, checked = false, disabled = false, onPress, ...props },
  ref,
) {
  const hintColor = color === 'gray' ? '$gray7' : '$blue9'
  const isActive = !!checked || indeterminate

  return (
    <Stack
      ref={ref}
      tag="button"
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      height={34}
      width={34}
      borderRadius={1000}
      alignItems="center"
      justifyContent="center"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.4 : 1}
      hoverStyle={!disabled ? { backgroundColor: '$blue2' } : undefined}
      pressStyle={!disabled ? { backgroundColor: '$blue2' } : undefined}
      {...props}
    >
      <Stack
        height={18}
        width={18}
        borderRadius={2}
        borderWidth={1}
        borderColor={isActive ? hintColor : '$textSecondary'}
        backgroundColor={isActive ? hintColor : 'transparent'}
        alignItems="center"
        justifyContent="center"
      >
        {isActive ? indeterminate && !checked ? <Minus size={14} color="$white2" /> : <Check size={14} color="$white2" /> : null}
      </Stack>
    </Stack>
  )
})
