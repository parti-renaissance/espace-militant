import { router } from 'expo-router';
import { XStack } from 'tamagui';
import { ArrowLeft, UserRound } from '@tamagui/lucide-icons';

import { VoxButton } from '@/components/Button';
import useShareApi from '@/hooks/useShareApi';
import clientEnv from '@/config/clientEnv';

const PRONO_SHARE_URL = `https://${clientEnv.ASSOCIATED_DOMAIN}/prono`

export default function PronoNavHeader() {
  const { shareAsync } = useShareApi()

  const handleInvite = () => {
    shareAsync({
      url: PRONO_SHARE_URL,
      message: `Défie Gabriel Attal sur le prochain match des Bleus ⚽\n${PRONO_SHARE_URL}`,
      title: 'Défie Gabriel Attal !',
    })
  }

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
        onPress={handleInvite}
      >
        J'invite un ami
      </VoxButton>
    </XStack>
  )
}
