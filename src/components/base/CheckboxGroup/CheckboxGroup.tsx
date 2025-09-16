import Checkbox from '@/components/base/Checkbox/Checkbox'
import Text from '@/components/base/Text'
import { styled } from '@tamagui/core'
import { ThemeableStack, useMedia, XStack } from 'tamagui'

type CheckboxGroupProps = {
  options: {
    label: string
    value: string
  }[]
  value: string[]
  onChange: (value: string[]) => void
}

const CheckboxGroupFrame = styled(ThemeableStack, {
  gap: '$medium',
  flexDirection: 'row',
  flexWrap: 'wrap',
})

export default function CheckboxGroup({ options, value, onChange }: CheckboxGroupProps) {
  const media = useMedia()
  const handlePress = (item: string) => () => {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item))
      return
    }
    onChange([...value, item])
  }

  const isChecked = (item: string) => value.includes(item)
  return (
    <CheckboxGroupFrame>
      {options.map((option) => (
        <XStack
          key={option.value}
          flexGrow={1}
          flexShrink={1}
          flexBasis={media.md ? '48%' : '100%'}
          gap="$small"
          group
          onPress={handlePress(option.value)}
          alignItems="center"
          cursor="pointer"
        >
          <Checkbox checked={isChecked(option.value)} onPress={handlePress(option.value)} />
          <Text.MD multiline>{option.label}</Text.MD>
        </XStack>
      ))}
    </CheckboxGroupFrame>
  )
}
