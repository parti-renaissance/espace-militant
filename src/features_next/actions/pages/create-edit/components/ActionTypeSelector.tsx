import { TouchableOpacity } from 'react-native'
import { XStack } from 'tamagui'

import Text from '@/components/base/Text'

import type { IconComponent } from '@/models/common.model'

type ActionTypeSelectorProps = {
  label: string
  Icon?: IconComponent
  selected: boolean
  onPress: () => void
}

export default function ActionTypeSelector({ Icon, ...props }: ActionTypeSelectorProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <XStack bg={props.selected ? '$green5' : '$green1'} px={16} py={10} borderRadius={99} gap="$small">
        {Icon ? <Icon size={16} color={props.selected ? '$white1' : '$green7'} /> : null}
        <Text fontSize={14} semibold color={props.selected ? '$white1' : '$green7'}>
          {props.label}
        </Text>
      </XStack>
    </TouchableOpacity>
  )
}
