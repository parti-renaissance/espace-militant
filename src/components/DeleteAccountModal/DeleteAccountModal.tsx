import { useCallback, useState } from 'react'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import { View } from 'tamagui'
import DeleteAccountModalStep1 from './Components/DeleteAccountModalStep1'
import DeleteAccountModalStep2 from './Components/DeleteAccountModalStep2'
import { useGetSuspenseProfil } from '@/services/profile/hook'

interface Props {
  isOpen: boolean
  onClose: () => void
  // Indicate if we should show "désadhésion" or "suppression"
  isDelete: boolean
}

export default function DeleteAccountModal({ isOpen, onClose, isDelete }: Readonly<Props>) {
  const [step, setStep] = useState(1)

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
        $gtMd={{
          width: 480,
        }}
      >
        {step === 1 && <DeleteAccountModalStep1 onClose={onClose} onConfirm={goToNextStep} isDelete={isDelete} />}
        {step === 2 && <DeleteAccountModalStep2 onClose={onClose} onConfirm={goToNextStep} isDelete={isDelete} />}
      </View>
    </ModalOrBottomSheet>
  )
}
