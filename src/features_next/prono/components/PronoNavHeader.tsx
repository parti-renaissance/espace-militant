import { router } from 'expo-router';
import { XStack } from 'tamagui';
import { ArrowLeft, UserRound } from '@tamagui/lucide-icons';



import { VoxButton } from '@/components/Button';





export default function PronoNavHeader() {
  return (
    <XStack width="100%" alignItems="center" justifyContent="space-between" paddingHorizontal="$medium" paddingVertical="$small">
      <VoxButton variant="text" iconLeft={ArrowLeft} iconSize={24} onPress={() => router.back()} />
      <VoxButton
        iconLeft={UserRound}
        size="md"
        backgroundColor="#EBEDFF"
        textColor="#27221F"
        hoverStyle={{ backgroundColor: '#DFE2FF' }}
        pressStyle={{ backgroundColor: '#DFE2FF' }}
      >
        Inviter un ami
      </VoxButton>
    </XStack>
  )
}
