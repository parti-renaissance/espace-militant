import { isWeb, View } from 'tamagui'
import { ArrowDown } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button/Button'

type Props = {
  onPress: () => void
  bottom: number
}

export function JumpToBottomButton({ onPress, bottom }: Props) {
  return (
    <View position={isWeb ? 'fixed' : 'absolute'} bottom={bottom} alignSelf="center" zIndex={101}>
      <VoxButton variant="contained" theme="gray" iconLeft={ArrowDown} size="md" shrink onPress={onPress} />
    </View>
  )
}

export default JumpToBottomButton
