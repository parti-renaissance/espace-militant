import { ComponentProps } from 'react'
import Switch from '@/components/base/SwitchV2/SwitchV2'
import Text from '@/components/base/Text'
import { styled } from '@tamagui/core'
import { ThemeableStack, XStack } from 'tamagui'

type SwitchGroupProps = {
  options: {
    label: string
    value: string
  }[]
  value: string[]
  onChange: (value: string[]) => void
  textProps?: ComponentProps<typeof Text.MD>
}

const SwitchGroupFrame = styled(ThemeableStack, {
  gap: '$medium',
  flexDirection: 'column',
})

export default function SwitchGroup({ options, value, onChange, textProps }: SwitchGroupProps) {
  const handlePress = (item: string) => () => {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item))
      return
    }
    onChange([...value, item])
  }

  const isChecked = (item: string) => value.includes(item)
  return (
    <SwitchGroupFrame>
      {options.map((option) => (
        <XStack key={option.value} gap="$xsmall" group onPress={handlePress(option.value)} alignItems="center" cursor="pointer" justifyContent="space-between">
          <Text.MD multiline flexShrink={1} {...textProps}>
            {option.label}
          </Text.MD>
          <Switch checked={isChecked(option.value)} onPress={handlePress(option.value)} />
        </XStack>
      ))}
    </SwitchGroupFrame>
  )
}
