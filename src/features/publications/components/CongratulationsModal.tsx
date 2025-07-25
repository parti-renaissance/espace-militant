import React from 'react'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import { VoxButton } from '@/components/Button'
import { Check, Eye, Home } from '@tamagui/lucide-icons'
import { View, YStack } from 'tamagui'
import Text from '@/components/base/Text'
import { router } from 'expo-router'

interface CongratulationsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CongratulationsModal({ isOpen, onClose }: CongratulationsModalProps) {
  return (
    <ModalOrBottomSheet open={isOpen} onClose={onClose} allowDrag>
      <YStack
        padding="$large"
        gap="$medium"
        alignItems="center"
        $gtMd={{
          width: 480,
        }}
      >
        <View backgroundColor="$blue4" borderRadius={20} width={40} height={40} justifyContent="center" alignItems="center">
          <Check size={24} color="white" />
        </View>

        <YStack gap="$small" alignItems="center">
          <Text.LG
            textAlign="center"
            color="$blue5"
          >
            Félicitations !
          </Text.LG>

          <Text.MD
            textAlign="center"
            primary
            semibold
          >
            Votre publication est en cours d'envoi.
          </Text.MD>

          <Text.SM
            textAlign="center"
            primary
          >
            Elle est déjà disponible sur l'accueil de l'espace militant de vos destinataires.
          </Text.SM>
        </YStack>
        <YStack gap="$medium" marginTop="$large" marginBottom="$large" alignItems="center" justifyContent="center" >
          <VoxButton
            theme="gray"
            variant='outlined'
            iconLeft={Home}
            onPress={() => {
              onClose()
              router.push('/')
            }}
            alignSelf="center"
          >
            Retour à l'accueil
          </VoxButton>
          <VoxButton
            theme="blue"
            onPress={onClose}
            iconLeft={Eye}
            alignSelf="center"
          >
            Voir la publication
          </VoxButton>
        </YStack>
      </YStack>
    </ModalOrBottomSheet>
  )
}
