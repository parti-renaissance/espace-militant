import { TouchableOpacity } from 'react-native'
import { XStack } from 'tamagui'

import Text from '@/components/base/Text'

import type { IconComponent } from '@/models/common.model'

export type CategoryChipTheme = 'green' | 'blue'

const chipThemeStyles: Record<
  CategoryChipTheme,
  { selectedBg: string; unselectedBg: string; color: string; selectedColor: string }
> = {
  green: { selectedBg: '$green5', unselectedBg: '$green1', color: '$green7', selectedColor: '$white1' },
  blue: { selectedBg: '$blue5', unselectedBg: '$blue1', color: '$blue7', selectedColor: '$white1' },
}

type ActionTypeSelectorProps = {
  label: string
  Icon?: IconComponent
  selected: boolean
  theme?: CategoryChipTheme
  onPress: () => void
}

export default function ActionTypeSelector({ Icon, theme = 'green', ...props }: ActionTypeSelectorProps) {
  const styles = chipThemeStyles[theme]

  return (
    <TouchableOpacity onPress={props.onPress}>
      <XStack bg={props.selected ? styles.selectedBg : styles.unselectedBg} px={16} py={10} borderRadius={99} gap="$small">
        {Icon ? <Icon size={16} color={props.selected ? styles.selectedColor : styles.color} /> : null}
        <Text fontSize={14} semibold color={props.selected ? styles.selectedColor : styles.color}>
          {props.label}
        </Text>
      </XStack>
    </TouchableOpacity>
  )
}
