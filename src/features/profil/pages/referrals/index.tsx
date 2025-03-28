import ScrollView from '@/features/profil/components/ScrollView'
import ReferralCodeCard from '@/features/profil/pages/referrals/components/ReferralCodeCard'
import ReferralListCard from '@/features/profil/pages/referrals/components/ReferralListCard'
import { YStack } from 'tamagui'

export default function ReferralsPage() {
  return (
    <ScrollView>
      <YStack gap={'$8'}>
        <ReferralCodeCard />
        <ReferralListCard />
      </YStack>
    </ScrollView>
  )
}
