import React from 'react'
import { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheet'
import Text from '@/components/base/Text'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { YStack } from 'tamagui'

interface Props {
  count: number
  label: string
  backgroundColor?: ColorValue
  color?: ColorValue
  isLoading?: boolean
}

export default function StatsCard({ count, label, backgroundColor, color, isLoading }: Readonly<Props>) {
  if (isLoading) {
    return <Skeleton />
  }

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
      width={'100%'}
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

const Skeleton = () => (
  <SkeCard width={150}>
    <SkeCard.Content>
      <SkeCard.Description />
    </SkeCard.Content>
  </SkeCard>
)
