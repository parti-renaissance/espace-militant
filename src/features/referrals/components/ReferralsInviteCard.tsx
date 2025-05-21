import { VoxButton } from '@/components/Button'
import { VoxCard } from '@/components/VoxCard/VoxCard'
import Text from '@/components/base/Text'
import ReferralFormModal from '@/features/referrals/components/ReferralFormModal'
import { useState, useCallback } from 'react'

const ReferralsInviteCard = () => {
  const [isOpen, setIsOpen] = useState(false)
  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <VoxCard bg="$orange1" inside flex={1}>
        <VoxCard.Content>
          <Text.LG fontWeight={600}>Invitation par email</Text.LG>
          <Text.SM color="$textSecondary" lineHeight={20} w="90%">
            Invitez ou préinscrivez directement une personne intéressée.
          </Text.SM>
          <VoxButton theme="orange" backgroundColor="$orange9" size="xl" onPress={openModal}>
            J’envoie une invitation
          </VoxButton>
        </VoxCard.Content>
      </VoxCard>
      <ReferralFormModal isOpen={isOpen} closeModal={closeModal} />
    </>
  )
}

export default ReferralsInviteCard
