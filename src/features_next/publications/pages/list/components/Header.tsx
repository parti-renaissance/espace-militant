import React, { useCallback } from 'react'
import { useRouter } from 'expo-router'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { Sparkle } from '@tamagui/lucide-icons'
import { XStack, YStack } from 'tamagui'

export function PublicationsListHeader() {
  const router = useRouter();

  const handleCreatePublication = useCallback(() => {
    router.push('/publications');
  }, [router]);

  return (
    <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$medium">
      <YStack flex={1} gap="$small">
        <Text.LG semibold>Mes publications</Text.LG>
        <Text.SM secondary>Gérez et analyser vos publications depuis votre tableau de bord</Text.SM>
      </YStack>
      <VoxButton variant="soft" theme="purple" iconLeft={Sparkle} size="lg" onPress={handleCreatePublication}>
        Nouvelle publication
      </VoxButton>
    </XStack>
  )
}
