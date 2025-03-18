import ScrollView from '@/features/profil/components/ScrollView'
import ReferralCodeCard from '@/features/profil/pages/referrals/components/ReferralCodeCard'
import { XStack, YStack } from 'tamagui'

export default function ReferralsPage() {
  return (
    <XStack>
      <YStack flex={1}>
        <ScrollView>
          <ReferralCodeCard />
        </ScrollView>
      </YStack>
    </XStack>
  )
}
