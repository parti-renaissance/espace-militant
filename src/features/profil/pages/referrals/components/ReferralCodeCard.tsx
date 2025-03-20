import React, { useMemo } from 'react'
import Text from '@/components/base/Text'
import InstanceCard from '@/components/InstanceCard/InstanceCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import InviteCard from '@/features/profil/pages/referrals/components/InviteCard'
import ReferralCode from '@/features/profil/pages/referrals/components/ReferralCode'
import ReferralLockedCard from '@/features/profil/pages/referrals/components/ReferralLockedCard'
import { useGetProfil } from '@/services/profile/hook'
import { HeartHandshake } from '@tamagui/lucide-icons'
import { useMedia } from 'tamagui'

const description = 'Parrainez de nouveaux adhérents qui feront notre force de demain.'

export default function ReferralCodeCard() {
  const { xs } = useMedia()
  const profil = useGetProfil()

  const isNotMember = useMemo(() => profil.data?.tags?.some((el) => el.code.includes('cotisation_nok')), [profil.data])
  if (isNotMember) {
    return <ReferralLockedCard hideHeader={xs} />
  }

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
