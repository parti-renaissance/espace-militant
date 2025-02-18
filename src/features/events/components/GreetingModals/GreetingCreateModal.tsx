import { ComponentProps } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { EventItemProps } from '@/features/events/types'
import { Copy, Share2, X } from '@tamagui/lucide-icons'
import { Image, XStack, YStack } from 'tamagui'
import { useEventSharing } from '../EventShareGroup'
import ViewportModal from './ViewportModal'

// eslint-disable-next-line
const EventIllustration = require('@/features/events/assets/images/event_illustration.png')

export const GreetingCreateModal = (props: { modalProps: ComponentProps<typeof ViewportModal> } & EventItemProps) => {
  const { copyUrl, isShareAvailable, openShareDialog } = useEventSharing({ event: props.event })
  const insets = useSafeAreaInsets()
  return (
    <ViewportModal
      {...props.modalProps}
      header={
        <XStack justifyContent="flex-end" width={50} zIndex={10} height={50} position="absolute" right="$small" top="$small">
          <VoxButton onPress={props.modalProps.onClose} variant="text" shrink iconLeft={X} size="lg" />
        </XStack>
      }
    >
      <VoxCard>
        <VoxCard.Content padding="$xlarge">
          <YStack gap="$medium" alignItems="center">
            <Image src={EventIllustration} />
            <Text.LG textAlign="center">Nouvel événement créé </Text.LG>
          </YStack>
        </VoxCard.Content>
        <YStack
          backgroundColor="$blue1"
          $sm={{
            paddingBottom: insets.bottom,
          }}
        >
          <VoxCard.Content padding="$xlarge">
            <YStack alignItems="center" gap="$medium">
              <Text.LG color="$blue7">Partagez le autour de vous</Text.LG>

              <XStack gap="$medium" justifyContent="space-between">
                <VoxButton variant="outlined" iconLeft={Copy} onPress={copyUrl}>
                  Copier le lien
                </VoxButton>
                {isShareAvailable ? (
                  <VoxButton theme="blue" iconLeft={Share2} onPress={openShareDialog}>
                    Partager
                  </VoxButton>
                ) : null}
              </XStack>
            </YStack>
          </VoxCard.Content>
        </YStack>
      </VoxCard>
    </ViewportModal>
  )
}
