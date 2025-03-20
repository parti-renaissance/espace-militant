import React, { useCallback, useState } from 'react'
import Text from '@/components/base/Text'
import InstanceCard from '@/components/InstanceCard/InstanceCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import InviteCard from '@/features/profil/pages/referrals/components/InviteCard'
import ReferralCode from '@/features/profil/pages/referrals/components/ReferralCode'
import ReferralFormModal from '@/features/profil/pages/referrals/components/ReferralFormModal'
import { HeartHandshake } from '@tamagui/lucide-icons'
import { useMedia } from 'tamagui'

const description = 'Parrainez de nouveaux adhérents qui feront notre force de demain.'

export default function ReferralCodeCard() {
  const { xs } = useMedia()
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  return (
    <>
      {xs ? (
        <VoxCard>
          <VoxCard.Content>
            <Text.SM>{description}</Text.SM>

            <ReferralCode />
            <InviteCard openModal={openModal} />
          </VoxCard.Content>
        </VoxCard>
      ) : (
        <InstanceCard title="Parrainages" icon={HeartHandshake} description={description}>
          <ReferralCode />
          <InviteCard openModal={openModal} />
        </InstanceCard>
      )}

      <ReferralFormModal isOpen={isOpen} closeModal={closeModal} />
    </>
  )
}
