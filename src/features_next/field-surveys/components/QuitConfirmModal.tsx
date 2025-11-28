import { Modal, Pressable, type GestureResponderEvent } from 'react-native'
import { Circle, XStack, YStack } from 'tamagui'
import { Trash2 } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import Text from '@/components/base/Text'

interface QuitConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function QuitConfirmModal({ isOpen, onClose, onConfirm }: QuitConfirmModalProps) {
  const handleBackdropPress = (event: GestureResponderEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <Modal 
      animationType="fade" 
      transparent 
      visible={isOpen}
      accessibilityLabel="Confirmation de sortie"
    >
      <Pressable 
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: 16,
        }}
        onPress={handleBackdropPress}
        accessibilityLabel="Fermer la modal"
      >
        <YStack
          backgroundColor="white"
          borderRadius="$medium"
          margin="$medium"
          padding="$medium"
          alignItems="center"
          justifyContent="center"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={4}
          elevation={5}
          gap="$medium"
          width="100%"
          maxWidth={480}
          minHeight={300}
          onPress={(e) => e.stopPropagation()}
        >
          <Circle 
            size={88} 
            backgroundColor="$orange1"
          >
            <Trash2 size={40} color="$orange5" />
          </Circle>
          
          <Text.LG semibold textAlign="center">
            Quitter le questionnaire
          </Text.LG>
          
          <YStack alignItems="center" marginBottom="$medium">
            <Text.MD secondary textAlign="center" textWrap="balance">
              Êtes-vous sûr de vouloir quitter le questionnaire ?
            </Text.MD>
            <Text.MD secondary textAlign="center" textWrap="balance">
              Toutes vos réponses seront perdues.
            </Text.MD>
          </YStack>
          
          <XStack gap="$3" alignItems="center" justifyContent="center">
            <VoxButton variant="outlined" onPress={onClose}>
              Annuler
            </VoxButton>
            <VoxButton variant="contained" theme="orange" onPress={onConfirm}>
              Quitter
            </VoxButton>
          </XStack>
        </YStack>
      </Pressable>
    </Modal>
  )
}
