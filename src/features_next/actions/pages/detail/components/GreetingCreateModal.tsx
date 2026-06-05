import { ComponentProps } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { useMedia, XStack, YStack } from 'tamagui'
import { Copy, Share2, X } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import { useActionSharing } from '@/components/ShareGroup/DetailShareGroup'
import Title from '@/components/Title/Title'
import VoxCard from '@/components/VoxCard/VoxCard'
import ActionIllustration from '@/features_next/actions/assets/illu-actions.png'

import type { RestActionFull } from '@/services/actions/schema'

type GreetingCreateModalProps = {
  action: RestActionFull
  modalProps: ComponentProps<typeof ModalOrBottomSheet>
}

export const GreetingCreateModal = (props: GreetingCreateModalProps) => {
  const { copyUrl, isShareAvailable, openShareDialog } = useActionSharing({ action: props.action })
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
            <Image source={ActionIllustration} style={{ height: 100, width: 100 }} contentFit="contain" />
            <Title size="h2">
              <Title.Text>Nouvelle action créée</Title.Text>
            </Title>
          </YStack>
          <VoxCard borderRadius="$medium" backgroundColor="$blue50" shadowColor="transparent" borderWidth={0}>
            <VoxCard.Content>
              <YStack alignItems="center" gap="$medium">
                <Text.LG color="$blue700" textAlign="center">
                  C’est quand même mieux à plusieurs
                </Text.LG>
                <Text.MD multiline medium textAlign="center">
                  Envoyez le lien d’inscription sur Telegram, WhatsApp ou même par email pour que l’on puisse vous rejoindre.
                </Text.MD>

                <XStack gap="$medium" justifyContent="center" width="100%">
                  <VoxButton theme="blue" variant="outlined" size="xl" iconLeft={Copy} onPress={copyUrl}>
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
              Voir l'action
            </VoxButton>
          </YStack>
        </VoxCard.Content>
      </VoxCard>
    </ModalOrBottomSheet>
  )
}
