import React from 'react'
import InstanceCard from '@/features/profil/pages/instances/components/InstanceCard'
import InviteCard from '@/features/profil/pages/referrals/components/InviteCard'
import ReferralCode from '@/features/profil/pages/referrals/components/ReferralCode'
import { HeartHandshake } from '@tamagui/lucide-icons'

export default function ReferralCodeCard() {
  return (
    <InstanceCard title="Parrainages" icon={HeartHandshake} description="Parrainez de nouveaux adhérents qui feront notre force de demain.">
      <ReferralCode />
      <InviteCard />
    </InstanceCard>
  )
}
