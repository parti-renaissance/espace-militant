import { useCallback, useState } from 'react'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import { View, useMedia } from 'tamagui'
import DeleteAccountModalStep1 from './Components/DeleteAccountModalStep1'
import DeleteAccountModalStep2 from './Components/DeleteAccountModalStep2'

interface Props {
  isOpen: boolean
  onClose: () => void
  isAdherent: boolean
}

export default function DeleteAccountModal({ isOpen, onClose, isAdherent }: Readonly<Props>) {
  const [step, setStep] = useState(1)
  const media = useMedia()

  const goToNextStep = useCallback(() => {
    if (step === 1) {
      setStep((v) => v + 1)
    } else {
      onClose()
    }
  }, [step])

  return (
    <ModalOrBottomSheet open={isOpen} onClose={onClose} allowDrag>
      <View
        width={media.gtMd ? 480 : undefined}
      >
        {step === 1 && <DeleteAccountModalStep1 onClose={onClose} onConfirm={goToNextStep} isAdherent={isAdherent} />}
        {step === 2 && <DeleteAccountModalStep2 onClose={onClose} onConfirm={goToNextStep} isAdherent={isAdherent} />}
      </View>
    </ModalOrBottomSheet>
  )
}
