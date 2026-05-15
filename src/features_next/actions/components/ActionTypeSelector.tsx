import { TouchableOpacity } from 'react-native'
import Text from '@/components/base/Text'
import type { IconComponent } from '@/models/common.model'
import { View } from 'tamagui'

type ActionTypeSelectorProps = {
  label: string
  Icon?: IconComponent
  description: string
  selected: boolean
  onPress: () => void
  compact?: boolean
}

export default function ActionTypeSelector({ Icon, compact, ...props }: ActionTypeSelectorProps) {
  return (
    <TouchableOpacity onPress={props.onPress} style={{ width: '100%' }}>
      <View borderWidth={1} borderColor={props.selected ? '$black' : '#919EAB29'} p={compact ? '$xsmall' : '$small'} borderRadius="$4">
        {Icon ? (
          <View mb={compact ? '$2' : '$3'}>
            <Icon size={compact ? 20 : undefined} />
          </View>
        ) : null}
        <View mb={compact ? 0 : '$2'}>
          <Text fontSize={compact ? 13 : 14} fontWeight="$6">
            {props.label}
          </Text>
        </View>
        {props.description ? (
          <View>
            <Text>{props.description}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}
