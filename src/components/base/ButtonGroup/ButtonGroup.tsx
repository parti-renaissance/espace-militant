import { ComponentPropsWithoutRef } from 'react'
import { VoxButton as Button } from '@/components/Button'
import { styled } from '@tamagui/core'
import { ThemeableStack, ThemeName } from 'tamagui'

type ButtonProps = ComponentPropsWithoutRef<typeof Button>

type ButtonGroupProps<VALUE extends string> = {
  theme?: ThemeName
  options: {
    label: string
    value: VALUE
  }[]
  value?: VALUE
  onChange: (value?: VALUE) => void
  switchMode?: boolean
  size?: ButtonProps['size']
  variant?: ButtonProps['variant']
}

const ButtonGroupFrame = styled(ThemeableStack, {
  gap: '$small',
  flexDirection: 'row',
  flexWrap: 'wrap',
})

export default function ButtonGroup<VALUE extends string>({
  options,
  value,
  onChange,
  theme,
  switchMode,
  size = 'sm',
  variant = 'contained',
  ...props
}: ButtonGroupProps<VALUE> & ComponentPropsWithoutRef<typeof ButtonGroupFrame>) {
  const handlePress = (item: VALUE) => () => {
    if (switchMode) {
      onChange(item)
    } else {
      onChange(item === value ? undefined : item)
    }
  }

  const isChecked = (item: VALUE) => value === item
  return (
    <ButtonGroupFrame {...props}>
      {options.map((option) => (
        <Button size={size} variant={variant} key={option.value} theme={theme} inverse={!isChecked(option.value)} onPress={handlePress(option.value)}>
          {option.label}
        </Button>
      ))}
    </ButtonGroupFrame>
  )
}
