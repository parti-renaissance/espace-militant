import Text from '@/components/base/Text'
import { XStack, YStack } from 'tamagui'

type BreadCrumbItem = {
  id: string
  label: string
  icon?: React.ReactNode
}

type BreadCrumbV2Props = {
  items: BreadCrumbItem[]
  value: string
  onChange?: (value: string) => void
}

const BreadCrumbV2 = ({ items, value, onChange }: BreadCrumbV2Props) => {
  return (
    <XStack
      backgroundColor="white"
      alignItems="center"
      gap={4}
    >
      {items.map((item, index) => {
        const isActive = item.id === value
        
        return (
          <XStack
            key={item.id}
            alignItems="center"
            justifyContent="center"
            paddingHorizontal={8}
            height={52}
            paddingLeft={index === 0 ? 20 : 8}
            cursor="pointer"
            onPress={() => onChange?.(item.id)}
            position="relative"
            flex={1}
          >
            <XStack alignItems="center" gap={8}>
              {item.icon}
              <Text.MD semibold>{item.label}</Text.MD>
            </XStack>
            
            {isActive && (
              <YStack
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                height={2}
                backgroundColor="$textPrimary"
              />
            )}
          </XStack>
        )
      })}
    </XStack>
  )
}

export default BreadCrumbV2
