import { useMedia, XStack, YStack } from 'tamagui'
import { Trash2 } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'

export interface DeleteMandateConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

export default function DeleteMandateConfirmModal({ open, onClose, onConfirm, isPending }: DeleteMandateConfirmModalProps) {
  const media = useMedia()

  return (
    <ModalOrBottomSheet open={open} onClose={onClose} allowDrag>
      <YStack
        paddingHorizontal="$medium"
        marginVertical={media.gtSm ? '$xxlarge' : '$xxxlarge'}
        gap="$large"
        alignItems="center"
        width={media.gtSm ? 480 : undefined}
      >
        <YStack gap="$medium" alignItems="center">
          <Trash2 size={32} color="$orange5" />
          <Text.LG textAlign="center" semibold>
            Confirmer la suppression
          </Text.LG>
          <Text.MD textAlign="center">Êtes-vous sûr de vouloir supprimer ce mandat ? Cette action est irréversible.</Text.MD>
        </YStack>

        <XStack gap="$medium" alignItems="center" justifyContent="center">
          <VoxButton theme="gray" variant="outlined" onPress={onClose} alignSelf="center">
            Annuler
          </VoxButton>
          <VoxButton theme="orange" onPress={onConfirm} disabled={isPending} alignSelf="center">
            {isPending ? 'Suppression...' : 'Supprimer'}
          </VoxButton>
        </XStack>
      </YStack>
    </ModalOrBottomSheet>
  )
}
