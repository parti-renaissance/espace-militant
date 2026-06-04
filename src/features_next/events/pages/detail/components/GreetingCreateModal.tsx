import { ComponentProps } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image, useMedia, XStack, YStack } from 'tamagui'
import { Copy, Share2, X } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import { useEventSharing } from '@/components/ShareGroup/DetailShareGroup'
import VoxCard from '@/components/VoxCard/VoxCard'
import EventIllustration from '@/features_next/events/assets/images/event_illustration.png'
import { EventItemProps } from '@/features_next/events/types'

export const GreetingCreateModal = (props: { modalProps: ComponentProps<typeof ModalOrBottomSheet> } & EventItemProps) => {
  const { copyUrl, isShareAvailable, openShareDialog } = useEventSharing({ event: props.event })
  const media = useMedia()
  const insets = useSafeAreaInsets()
  const bottomPadding = insets.bottom > 0 ? insets.bottom : 16

  return (
    <ModalOrBottomSheet open={props.modalProps?.open} onClose={props.modalProps?.onClose} allowDrag>
      {media.gtSm ? (
        <XStack justifyContent="flex-end" width={50} zIndex={10} height={50} position="absolute" right="$small" top="$small">
          <VoxButton onPress={props.modalProps.onClose} variant="text" shrink iconLeft={X} size="lg" />
        </XStack>
      ) : null}
      <VoxCard borderColor="$colorTransparent" maxWidth={media.gtSm ? 420 : '100%'} pt="$medium" pb={bottomPadding}>
        <VoxCard.Content gap="$xlarge">
          <YStack gap="$medium" alignItems="center">
            <Image source={EventIllustration} />
            <Text.LG textAlign="center">Nouvel événement créé</Text.LG>
          </YStack>
          <VoxCard borderRadius="$medium" backgroundColor="$blue1">
            <VoxCard.Content>
              <YStack alignItems="center" gap="$medium">
                <Text.LG color="$blue8" textAlign="center">
                  C’est quand même mieux à plusieurs
                </Text.LG>
                <Text.MD medium textAlign="center">
                  Envoyez le lien d’inscription sur Telegram, WhatsApp ou même par email pour que l’on puisse vous rejoindre.
                </Text.MD>

                <XStack gap="$medium" justifyContent="center" width="100%">
                  <VoxButton variant="outlined" size="xl" flexGrow={1} iconLeft={Copy} onPress={copyUrl}>
                    Copier le lien
                  </VoxButton>
                  {isShareAvailable ? (
                    <VoxButton theme="blue" size="xl" flexGrow={1} iconLeft={Share2} onPress={openShareDialog}>
                      Partager
                    </VoxButton>
                  ) : null}
                </XStack>
              </YStack>
            </VoxCard.Content>
          </VoxCard>
          <YStack width="100%">
            <VoxButton theme="gray" variant="soft" size="xl" width="100%" onPress={props.modalProps.onClose}>
              Voir l'événement
            </VoxButton>
          </YStack>
        </VoxCard.Content>
      </VoxCard>
    </ModalOrBottomSheet>
  )
}
