import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { RotateCw } from '@tamagui/lucide-icons'
import { Image, View, XStack } from 'tamagui'
import useResetFilters from '../hooks/useResetFilters'

export default function EmptyState() {
  const { handleReset } = useResetFilters()
  return (
    <View alignSelf="center" alignContent="center" gap="$large" alignItems={'center'} justifyContent="center" flex={1}>
      <XStack>
        <VoxButton iconLeft={RotateCw} size="sm" theme="blue" onPress={handleReset}>
          Réinitialiser les filtres
        </VoxButton>
      </XStack>
      <XStack width="100%" maxWidth={342}>
        <Image
          source={require('@/assets/images/empty_card_state.png')}
          width="100%"
          mb="$medium"
          resizeMode="contain"
          justifyContent="center"
          alignSelf="center"
        />
      </XStack>
      <Text semibold textAlign="center">
        Aucun événement ne correspond à votre recherche
      </Text>
    </View>
  )
}
