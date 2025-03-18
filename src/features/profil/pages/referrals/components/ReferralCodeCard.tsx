import React from 'react'
import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'
import InstanceCard from '@/features/profil/pages/instances/components/InstanceCard'
import InviteCard from '@/features/profil/pages/referrals/components/InviteCard'
import ReferralCode from '@/features/profil/pages/referrals/components/ReferralCode'
import { HeartHandshake } from '@tamagui/lucide-icons'
import { ScrollView, useMedia } from 'tamagui'

const description = 'Parrainez de nouveaux adhérents qui feront notre force de demain.'

export default function ReferralCodeCard() {
  const { xs } = useMedia()

  return (
    <ScrollView>
      {xs ? (
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
      )}
    </ScrollView>
  )
}
