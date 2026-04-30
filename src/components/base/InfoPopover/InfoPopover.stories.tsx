import { Button, Popover, Text, XStack, YStack } from 'tamagui'

import { VoxButton } from '@/components/Button'

import { InfoPopover, InfoPopoverContent, InfoPopoverTrigger } from './InfoPopover'

export default {
  title: 'InfoPopover',
  component: InfoPopover,
}

const directions = ['top', 'bottom', 'left', 'right'] as const
const aligns = ['start', 'center', 'end'] as const

export function Showcase() {
  return (
    <YStack gap="$large" p="$large" maxWidth={1000}>
      <YStack gap="$small">
        <Text fontSize="$7" fontWeight="700">
          Directions
        </Text>
        <XStack flexWrap="wrap" gap="$small">
          {directions.map((direction) => (
            <InfoPopover key={direction} direction={direction} align="center">
              <InfoPopoverTrigger asChild>
                <Button>{direction}</Button>
              </InfoPopoverTrigger>
              <InfoPopoverContent offset={6}>
                <YStack maxWidth={240} gap="$2">
                  <Text color="$white1" fontWeight="700">
                    Aide
                  </Text>
                  <Text color="$white1">{`Popover ouvert vers ${direction}.`}</Text>
                </YStack>
              </InfoPopoverContent>
            </InfoPopover>
          ))}
        </XStack>
      </YStack>

      <YStack gap="$small">
        <Text fontSize="$7" fontWeight="700">
          Alignements
        </Text>
        <XStack flexWrap="wrap" gap="$small">
          {aligns.map((align) => (
            <InfoPopover key={align} direction="bottom" align={align}>
              <InfoPopoverTrigger asChild>
                <Button>{`bottom-${align}`}</Button>
              </InfoPopoverTrigger>
              <InfoPopoverContent offset={10}>
                <YStack maxWidth={260} gap="$2">
                  <Text color="$white1" fontWeight="700">
                    Alignement
                  </Text>
                  <Text color="$white1">{`Placement: bottom-${align}`}</Text>
                </YStack>
              </InfoPopoverContent>
            </InfoPopover>
          ))}
        </XStack>
      </YStack>

      <YStack gap="$small">
        <Text fontSize="$7" fontWeight="700">
          Contenu riche
        </Text>
        <InfoPopover direction="bottom" align="center">
          <InfoPopoverTrigger asChild>
            <Button>Voir l'aide avancée</Button>
          </InfoPopoverTrigger>
          <InfoPopoverContent offset={8}>
            <YStack maxWidth={320} gap="$3">
              <Text color="$white1" fontWeight="700">
                Configurer une publication
              </Text>
              <Text color="$white1">Utilisez les filtres pour cibler une audience et validez l'aperçu avant envoi.</Text>
              <Text color="$white1">Astuce: vous pouvez enregistrer votre brouillon à tout moment.</Text>
              <XStack justifyContent="flex-end">
                <Popover.Close asChild>
                  <VoxButton variant="soft" size="xs" theme="gray">
                    Compris
                  </VoxButton>
                </Popover.Close>
              </XStack>
            </YStack>
          </InfoPopoverContent>
        </InfoPopover>
      </YStack>
    </YStack>
  )
}
