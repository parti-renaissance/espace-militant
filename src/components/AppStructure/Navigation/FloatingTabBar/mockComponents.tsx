import { ScrollView } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'
import { CircleHelp, LifeBuoy, RefreshCcw } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'

const MOCK_FEATUREBASE_ITEMS = [
  { icon: RefreshCcw, text: 'Dernières mises à jour' },
  { icon: CircleHelp, text: 'Demande de retours' },
  { icon: LifeBuoy, text: "Centre d'aide" },
] as const

export const MockScopeSelector = () => (
  <XStack padding={12} gap="$small" justifyContent="space-between" borderRadius={8} backgroundColor="$pink1" alignItems="center">
    <YStack gap={2} flex={1}>
      <Text fontSize={14} fontWeight="600" color="#2A2422">
        Île-de-France
      </Text>
      <Text fontSize={12} color="#6E6764">
        Responsable de circonscription
      </Text>
    </YStack>
  </XStack>
)

export const MockFeaturebaseFooter = () => (
  <ScrollView
    horizontal
    nestedScrollEnabled
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ gap: 8, paddingRight: 32, paddingLeft: 16, paddingTop: 16 }}
  >
    {MOCK_FEATUREBASE_ITEMS.map((item) => (
      <VoxButton key={item.text} variant="outlined" theme="gray" iconLeft={item.icon} onPress={() => {}}>
        {item.text}
      </VoxButton>
    ))}
  </ScrollView>
)

export const mockCadreSheetHeader = (
  <YStack paddingHorizontal={16} marginBottom={12}>
    <MockScopeSelector />
  </YStack>
)

export const mockCadreSheetFooter = <MockFeaturebaseFooter />
