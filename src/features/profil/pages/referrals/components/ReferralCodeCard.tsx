import React from 'react'
import Text from '@/components/base/Text'
import InstanceCard from '@/components/InstanceCard/InstanceCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import InviteCard from '@/features/profil/pages/referrals/components/InviteCard'
import ReferralCode from '@/features/profil/pages/referrals/components/ReferralCode'
import { HeartHandshake } from '@tamagui/lucide-icons'
import { useMedia } from 'tamagui'

const description = 'Parrainez de nouveaux adhérents qui feront notre force de demain.'

export default function ReferralCodeCard() {
  const { xs } = useMedia()

  return xs ? (
    <VoxCard>
      <VoxCard.Content>
        <Text.SM>{description}</Text.SM>

        <ReferralCode />
        <InviteCard />
      </VoxCard.Content>
    </VoxCard>
  ) : (
    <InstanceCard title="Parrainages" icon={HeartHandshake} description={description}>
      <ReferralCode />
      <InviteCard />
    </InstanceCard>
  )
}
