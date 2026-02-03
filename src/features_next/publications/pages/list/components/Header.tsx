import React, { useCallback } from 'react'
import { useRouter } from 'expo-router'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { Sparkle } from '@tamagui/lucide-icons'
import { useMedia, View, XStack, YStack } from 'tamagui'
import BigSwitch from '@/components/base/BigSwitch'
import { Header } from '@/components/AppStructure'
import { PublicationsFilters } from '../index'

function HeaderTop({ handleCreatePublication }: { handleCreatePublication: () => void }) {
  const media = useMedia()

  if (media.sm) {
    return null
  }

  return (
    <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$medium">
      <YStack flex={1} gap="$small">
        <Text.LG semibold>Mes publications</Text.LG>
        <Text.SM secondary>Gérez et analyser vos publications depuis votre tableau de bord</Text.SM>
      </YStack>
      <VoxButton variant="soft" theme="purple" iconLeft={Sparkle} size="lg" onPress={handleCreatePublication}>
        {media.md ? 'Envoyer' : 'Envoyer une publication'}
      </VoxButton>
    </XStack>
  )
}

export function PublicationsListHeader({ onFilterChange, filters = {} }: { onFilterChange?: (filters: PublicationsFilters) => void; filters?: PublicationsFilters }) {
  const router = useRouter();
  const media = useMedia();

  const handleCreatePublication = useCallback(() => {
    router.push('/publications');
  }, [router]);

  const handleStatusChange = useCallback((status: 'draft' | 'sent' | undefined) => {
    onFilterChange?.({ ...filters, status });
  }, [filters, onFilterChange]);

  return (
    <YStack>
      <HeaderTop handleCreatePublication={handleCreatePublication} />
      <View
      justifyContent="space-between" 
      flexDirection={media.sm ? 'column' : 'row'} 
      gap={12} 
      paddingHorizontal={media.sm ? '$medium' : 0}
      marginTop="$medium"
      >
        <YStack maxWidth={media.sm ? undefined : 358} width="100%">
          <BigSwitch
            options={[
              { label: 'Toutes', value: undefined },
              { label: 'Publiées', value: 'sent' },
              { label: 'Brouillons', value: 'draft' },
            ]}
            value={filters.status}
            onChange={(value) => handleStatusChange(value as 'draft' | 'sent' | undefined)}
          />
        </YStack>
        <XStack display="none">
          <VoxButton variant="outlined" iconLeft={Sparkle} size="lg" onPress={handleCreatePublication}>
            Filtre
          </VoxButton>
        </XStack>
      </View>
    </YStack>

  )
}
