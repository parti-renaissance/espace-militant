import Text from '@/components/base/Text'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import { Image, YStack } from 'tamagui'

interface Props {
  isOpen: boolean
  closeModal: () => void
}

export default function ReferralSuccessModal({ isOpen, closeModal }: Props) {
  return (
    <ModalOrBottomSheet allowDrag open={isOpen} onClose={closeModal}>
      <YStack gap={'$8'}>
        <Image source={require('@/assets/illustrations/sent.png')} />
        <Text.MD bold>Et hop, une invitation envoyée à Julie !</Text.MD>
        <Text>Dans quelques minutes, il lui sera possible d’adhérer depuis un lien contenu dans l’email.</Text>
        <Text>Il lui sera également possible de signaler une invitation non sollicitée.</Text>
      </YStack>
    </ModalOrBottomSheet>
  )
}
