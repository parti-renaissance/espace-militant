import { Keyboard } from 'react-native'
import { isWeb, YStack } from 'tamagui'

import Text from '@/components/base/Text'

import NuitHead from './NuitHead'

export function EmptyState() {
  const handlePress = () => {
    if (!isWeb) Keyboard.dismiss()
  }

  return (
    <YStack flex={1} width="100%" minHeight="100%" justifyContent="center" alignItems="center" p="$medium" onPress={handlePress}>
      <YStack width="100%" maxWidth={520} alignItems="center" gap="$large">
        <NuitHead />
        <Text.LG primary semibold multiline textAlign="center">
          Éducation, économie, écologie… Sur quel sujet souhaitez-vous connaître nos propositions ?
        </Text.LG>
      </YStack>
    </YStack>
  )
}

export default EmptyState
