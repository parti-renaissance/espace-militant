import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image, useMedia, XStack, YStack } from 'tamagui'
import { Plus, X } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import Title from '@/components/Title/Title'
import VoxCard from '@/components/VoxCard/VoxCard'
import ILLUMATERIEL from '@/features/events/assets/images/illu-materiel.png'

type MaterielOrderAccessModalProps = {
  open: boolean
  onClose: () => void
  onOpenOrganizeModal: () => void
}

export function MaterielOrderAccessModal({ open, onClose, onOpenOrganizeModal }: MaterielOrderAccessModalProps) {
  const media = useMedia()
  const insets = useSafeAreaInsets()
  const bottomPadding = insets.bottom > 0 ? insets.bottom : 16

  const handleOrganize = () => {
    onClose()
    onOpenOrganizeModal()
  }

  return (
    <ModalOrBottomSheet open={open} onClose={onClose} allowDrag>
      {media.gtSm ? (
        <XStack justifyContent="flex-end" width={50} zIndex={10} height={50} position="absolute" right="$small" top="$small">
          <VoxButton onPress={onClose} variant="text" shrink iconLeft={X} size="lg" />
        </XStack>
      ) : null}
      <VoxCard borderColor="$colorTransparent" maxWidth={media.gtSm ? 420 : '100%'} pt="$medium" pb={bottomPadding}>
        <VoxCard.Content gap="$xlarge" px={media.gtSm ? '$large' : '$medium'}>
          <YStack gap="$medium" alignItems="center">
            <Image source={ILLUMATERIEL} width={84} height={112} objectFit="contain" />
            <Title size="h2">
              <Title.Text>Commande de matériel</Title.Text>
            </Title>
          </YStack>
          <Text.MD multiline secondary>
            La commande de matériel est réservée aux actions de terrain. Créez votre premier événement (tractage, collage, porte-à-porte...) pour y accéder !
          </Text.MD>
          <YStack width="100%" gap="$medium">
            <VoxButton theme="pink" variant="contained" size="xl" width="100%" iconLeft={Plus} onPress={handleOrganize}>
              Organiser un événement
            </VoxButton>
            <VoxButton theme="gray" variant="soft" size="xl" width="100%" onPress={onClose}>
              Fermer
            </VoxButton>
          </YStack>
        </VoxCard.Content>
      </VoxCard>
    </ModalOrBottomSheet>
  )
}
