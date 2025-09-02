import { TouchableOpacity } from 'react-native'
import Text from '@/components/base/Text'
import type { IconComponent } from '@/models/common.model'
import { View } from 'tamagui'

type ActionTypeEntryProps = {
  label: string
  Icon?: IconComponent
  description: string
  selected: boolean
  onPress: () => void
}

export default function ActionTypeEntry({ Icon, ...props }: ActionTypeEntryProps) {
  return (
    <TouchableOpacity onPress={props.onPress} style={{ width: '100%' }}>
      <View borderWidth={1} borderColor={props.selected ? '$black' : '#919EAB29'} p={'$small'} borderRadius={'$4'}>
        {!!Icon && (
          <View mb={'$3'}>
            <Icon />
          </View>
        )}

        <View mb={'$2'}>
          <Text fontSize={14} fontWeight={'$6'}>
            {props.label}
          </Text>
        </View>

        {props.description && (
          <View>
            <Text>{props.description}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}
