import { View } from 'tamagui'

import { ReferralLockedCard } from '@/features/referrals/components/Cards'

export function ReferralsDenyScreen() {
  return (
    <View maxWidth={580} width="100%" mx="auto" mt="$medium">
      <ReferralLockedCard />
    </View>
  )
}
