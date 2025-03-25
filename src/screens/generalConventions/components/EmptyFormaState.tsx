import EmptyStateFormationIllustration from '@/assets/illustrations/EmptyStateFormationIllustration'
import Text from '@/components/base/Text'
import { YStack } from 'tamagui'

export default function () {
  return (
    <YStack gap="$medium" justifyContent="center" width={300} padding={40} borderRadius={16} background={'white'} alignItems="center">
      <EmptyStateFormationIllustration />
      <Text.LG multiline semibold>
        Aucun élément
      </Text.LG>
    </YStack>
  )
}
