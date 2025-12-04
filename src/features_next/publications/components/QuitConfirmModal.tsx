import React, { useState } from 'react'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import Button, { VoxButton } from '@/components/Button'
import { File, Trash2, X } from '@tamagui/lucide-icons'
import { useMedia, XStack, YStack } from 'tamagui'
import Text from '@/components/base/Text'
import { useToastController } from '@tamagui/toast'
import { useDeleteMessage } from '@/services/publications/hook'

interface QuitConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  messageId?: string
  scope?: string
}

export default function QuitConfirmModal({ isOpen, onClose, onConfirm, messageId, scope }: QuitConfirmModalProps) {
  const media = useMedia()
  const toast = useToastController()
  const deleteMessage = useDeleteMessage({ messageId, scope })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDeleteDraft = () => {
    if (!messageId || !scope) {
      toast.show('Erreur', {
        message: 'Impossible de supprimer ce brouillon. Informations manquantes.',
        type: 'error'
      })
      return
    }

    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    deleteMessage.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false)
        onClose()
        onConfirm()
      }
    })
  }

  return (
    <>
      <ModalOrBottomSheet open={isOpen} onClose={onClose} allowDrag>
        {media.gtSm
          ? (
            <XStack justifyContent="flex-end" width={50} zIndex={10} height={50} position="absolute" right="$small" top="$small">
              <Button onPress={onClose} variant='text' shrink size="lg">
                <X size={24} color="$textPrimary" />
              </Button>
            </XStack>
          )
          : null
        }
        <YStack
          paddingHorizontal="$medium"
          marginVertical={media.gtSm ? "$xxlarge" : "$xxxlarge"}
          gap="$large"
          alignItems="center"
          width={media.gtSm ? 500 : undefined}
        >
          <YStack gap="$medium" alignItems="center">
            <File size={32} color="$blue5" />
            <Text
              textAlign="center"
              color="$blue5"
              fontSize={32}
            >
              Brouillon enregistré
            </Text>
          </YStack>
          <YStack gap="$small" alignItems="center">
            <YStack gap="$small" alignItems="center">
              <Text.MD
                textAlign="center"
                primary
                semibold
              >
                Votre publication est automatiquement{'\n'}enregistrée dans vos brouillons.
              </Text.MD>

              <Text.SM
                textAlign="center"
                primary
              >
                Vous pourrez reprendre son édition plus tard.
              </Text.SM>
            </YStack>
          </YStack>
          <YStack gap={media.sm ? '$xxxlarge' : '$large'} alignItems="center" justifyContent="center" >
            <VoxButton
              theme="orange"
              variant='outlined'
              iconLeft={Trash2}
              onPress={handleDeleteDraft}
              disabled={deleteMessage.isPending}
              alignSelf="center"
            >
              {deleteMessage.isPending ? 'Suppression...' : 'Supprimer ce brouillon'}
            </VoxButton>
            <VoxButton
              theme="blue"
              onPress={onConfirm}
              alignSelf="center"
            >
              Quitter l'édition
            </VoxButton>
          </YStack>
        </YStack>
      </ModalOrBottomSheet>

      {/* Modal de confirmation de suppression */}
      <ModalOrBottomSheet open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} allowDrag>
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
              Êtes-vous sûr de vouloir supprimer définitivement ce brouillon ? Cette action est irréversible.
            </Text.MD>
          </YStack>



          <XStack gap="$medium" alignItems="center" justifyContent="center">
            <VoxButton
              theme="gray"
              variant='outlined'
              onPress={() => setShowDeleteConfirm(false)}
              alignSelf="center"
            >
              Annuler
            </VoxButton>
            <VoxButton
              theme="orange"
              onPress={confirmDelete}
              disabled={deleteMessage.isPending}
              alignSelf="center"
            >
              {deleteMessage.isPending ? 'Suppression...' : 'Supprimer'}
            </VoxButton>
          </XStack>
        </YStack>
      </ModalOrBottomSheet>
    </>
  )
}
