import { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheet'
import Text from '@/components/base/Text'
import { YStack } from 'tamagui'

interface Props {
  count: number
  label: string
  backgroundColor?: ColorValue
  color?: ColorValue
}

export default function StatsCard({ count, label, backgroundColor, color }: Readonly<Props>) {
  return (
    <YStack
      gap={'$4'}
      alignItems={'center'}
      height={92}
      backgroundColor={backgroundColor}
      justifyContent={'center'}
      paddingHorizontal={'$6'}
      paddingVertical={'$8'}
      borderRadius={'$4'}
      $gtXs={{
        minWidth: 143,
      }}
    >
      <Text fontSize={24} fontWeight={600}>
        {count}
      </Text>
      <Text.SM color={color} textAlign={'center'} fontWeight={500}>
        {label}
      </Text.SM>
    </YStack>
  )
}
