import { router } from 'expo-router';
import { XStack } from 'tamagui';
import { ArrowLeft, UserRound } from '@tamagui/lucide-icons';



import { VoxButton } from '@/components/Button';

export default function PronoNavHeader() {
  return (
    <XStack width="100%" alignItems="center" justifyContent="space-between" paddingHorizontal="$medium" paddingTop="$xxxlarge">
      <VoxButton variant="text" iconLeft={ArrowLeft} iconSize={20} textColor="#5B5651" onPress={() => router.back()}>
        Retour
      </VoxButton>
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
