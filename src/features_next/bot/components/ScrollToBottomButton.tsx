import { Platform } from 'react-native'
import { isWeb, View } from 'tamagui'
import { ArrowDown } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button/Button'

type Props = {
  onPress: () => void
  keyboardHeight: number
}

export function ScrollToBottomButton({ onPress, keyboardHeight }: Props) {
  return (
    <View
      position={isWeb ? 'fixed' : 'absolute'}
      bottom={isWeb ? 180 : 140 + keyboardHeight + (Platform.OS === 'android' ? 16 : 0)}
      alignSelf="center"
      zIndex={101}
    >
      <VoxButton variant="contained" theme="gray" iconLeft={ArrowDown} size="md" shrink onPress={onPress} />
    </View>
  )
}

export default ScrollToBottomButton
