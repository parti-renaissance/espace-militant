import React from 'react'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import Button, { VoxButton } from '@/components/Button'
import { File, Trash2, X } from '@tamagui/lucide-icons'
import { useMedia, XStack, YStack } from 'tamagui'
import Text from '@/components/base/Text'
import { AlertUtils } from '@/screens/shared/AlertUtils'

interface QuitConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function QuitConfirmModal({ isOpen, onClose, onConfirm }: QuitConfirmModalProps) {
  const media = useMedia()

  return (
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
        marginVertical="$xxxlarge"
        gap="$large"
        alignItems="center"
        $gtSm={{
          width: 480,
          marginVertical: "$xxlarge",
        }}
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
        <YStack gap="$large" $sm={{ gap: '$xxxlarge' }} alignItems="center" justifyContent="center" >
          <VoxButton
            theme="orange"
            variant='outlined'
            iconLeft={Trash2}
            onPress={() => {
              AlertUtils.showSimpleAlert(
                'En cours de développement',
                'Cette fonctionnalité n\'est pas encore disponible.',
                'OK',
                'Annuler',
                () => {
                  onConfirm()
                }
              )
            }}
            alignSelf="center"
          >
            Supprimer ce brouillon
          </VoxButton>
          <VoxButton
            theme="blue"
            onPress={onConfirm}
            alignSelf="center"
          >
            Quitter l’édition
          </VoxButton>
        </YStack>
      </YStack>
    </ModalOrBottomSheet>
  )
}
