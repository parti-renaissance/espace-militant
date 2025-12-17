import React from 'react'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import { VoxButton } from '@/components/Button'
import { Trash2 } from '@tamagui/lucide-icons'
import { useMedia, XStack, YStack } from 'tamagui'
import Text from '@/components/base/Text'
import { useDeleteMessage } from '@/services/publications/hook'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  messageId: string | null
  scope: string
}

export default function DeleteModal({ isOpen, onClose, messageId, scope }: DeleteModalProps) {
  const media = useMedia()
  const deleteMessage = useDeleteMessage({ messageId: messageId || undefined, scope })

  const handleConfirm = () => {
    if (!messageId) return
    
    deleteMessage.mutate(undefined, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  return (
    <ModalOrBottomSheet open={isOpen} onClose={onClose} allowDrag>
      <YStack
        paddingHorizontal="$medium"
        marginVertical={media.gtSm ? "$xxlarge" : "$xxxlarge"}
        gap="$large"
        alignItems="center"
        width={media.gtSm ? 480 : undefined}
      >
        <YStack gap="$medium" alignItems="center">
          <Trash2 size={32} color="$orange5" />
          <Text.LG
            textAlign="center"
            semibold
          >
            Confirmer la suppression
          </Text.LG>
          <Text.MD
            textAlign="center"
          >
            Êtes-vous sûr de vouloir supprimer définitivement cette publication ? Cette action est irréversible.
          </Text.MD>
        </YStack>

        <XStack gap="$medium" alignItems="center" justifyContent="center">
          <VoxButton
            theme="gray"
            variant='outlined'
            onPress={onClose}
            alignSelf="center"
          >
            Annuler
          </VoxButton>
          <VoxButton
            theme="orange"
            onPress={handleConfirm}
            disabled={deleteMessage.isPending}
            alignSelf="center"
          >
            {deleteMessage.isPending ? 'Suppression...' : 'Supprimer'}
          </VoxButton>
        </XStack>
      </YStack>
    </ModalOrBottomSheet>
  )
}

