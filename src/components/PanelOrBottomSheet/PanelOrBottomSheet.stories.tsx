import React, { useState } from 'react'
import { YStack } from 'tamagui'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'

import PanelOrBottomSheet from './PanelOrBottomSheet'

export default {
  title: 'Components/PanelOrBottomSheet',
  component: PanelOrBottomSheet,
}

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <YStack flex={1} padding="$medium" gap="$medium" backgroundColor="$background">
      <Text.LG semibold>PanelOrBottomSheet</Text.LG>
      <Text.SM secondary>Grand écran : panneau latéral. Petit écran : bottom sheet.</Text.SM>
      <VoxButton size="lg" theme="green" onPress={() => setIsOpen(true)}>
        Ouvrir le panel
      </VoxButton>
      <PanelOrBottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <YStack gap="$small" padding="$medium">
          <Text.MD semibold>Contenu du panneau</Text.MD>
          <Text.SM secondary>Glisser vers le bas pour fermer (mobile).</Text.SM>
          <Text.SM secondary>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris.
          </Text.SM>
          <Text.SM secondary>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Text.SM>
          <Text.SM secondary>
            Curabitur pretium tincidunt lacus. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum
            sapien proin quam etiam ultricies.
          </Text.SM>
          <Text.SM secondary>
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas fermentum consequat mi. Donec fermentum.
            Pellentesque malesuada nulla a mi.
          </Text.SM>
          <Text.SM secondary>
            Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper,
            ligula eu tempor congue, eros est euismod turpis.
          </Text.SM>
          <VoxButton onPress={() => setIsOpen(false)}>Fermer</VoxButton>
        </YStack>
      </PanelOrBottomSheet>
    </YStack>
  )
}
