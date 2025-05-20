import React from 'react'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import ReferralForm from '@/features/referrals/components/ReferralForm'
import { Redirect } from 'expo-router'
import { isWeb, useMedia } from 'tamagui'

interface Props {
  isOpen: boolean
  closeModal: () => void
}

export default function ReferralFormModal({ isOpen, closeModal }: Readonly<Props>) {
  const { xs } = useMedia()
  if (isWeb && xs) {
    if (isOpen) {
      return <Redirect href={'/profil/invitation'} />
    }
    return null
  }

  return (
    <ModalOrBottomSheet allowDrag open={isOpen} onClose={closeModal}>
      <ReferralForm close={closeModal} />
    </ModalOrBottomSheet>
  )
}
