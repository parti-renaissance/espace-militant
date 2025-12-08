import { View, XStack, YStack, useMedia } from 'tamagui'

import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import StickyBox from '@/components/StickyBox/StickyBox'
import { ReferralsRankingCardLoading } from '@/features_next/referrals/components/Cards'
import useLayoutSpacing from '@/components/AppStructure/hooks/useLayoutSpacing'

export function ReferralsDesktopSkeleton() {
  const spacingValues = useLayoutSpacing(true)
  
  return (
    <View style={{ width: '100%', paddingTop: spacingValues.paddingTop, paddingBottom: 100, backgroundColor: '$textSurface' }}>
      <View backgroundColor="$orange1" pt="$6" pb={52} borderRadius="$medium" mx={spacingValues.paddingLeft}>
        <View maxWidth={480} width="100%" margin="auto">
          <SkeCard height={280}>
            <SkeCard.Content>
              <SkeCard.Image />
              <SkeCard.Line width="100%" />
            </SkeCard.Content>
          </SkeCard>
        </View>
      </View>
      <View mt={-48}>
        <View maxWidth={780} width="100%" margin="auto">
          <VoxCard>
            <VoxCard.Content>
              <XStack gap="$medium">
                <YStack flex={1}>
                  <SkeCard>
                    <SkeCard.Image />
                  </SkeCard>
                </YStack>
                <YStack flex={1}>
                  <SkeCard>
                    <SkeCard.Image />
                  </SkeCard>
                </YStack>
              </XStack>
            </VoxCard.Content>
          </VoxCard>
        </View>
      </View>
      <XStack maxWidth={780} py="$medium" width="100%" margin="auto" height="auto">
        <StickyBox offsetTop="$xxlarge" offsetBottom="$medium">
          <View pr="$medium" width={200}>
            <SkeCard>
              <SkeCard.Content>
                <SkeCard.Line width={100} />
                <SkeCard.Line width={100} />
              </SkeCard.Content>
            </SkeCard>
          </View>
        </StickyBox>
        <YStack gap="$medium" flex={1}>
          <YStack gap="$medium">
            <YStack gap="$medium">
              <ReferralsRankingCardLoading />
            </YStack>
          </YStack>
          <YStack flex={1}>
            <ReferralsRankingCardLoading />
          </YStack>
        </YStack>
      </XStack>
    </View>
  )
}

export function ReferralsMobileSkeleton() {
  return (
    <View style={{ width: '100%', paddingBottom: 100, backgroundColor: '$textSurface' }}>
      <View backgroundColor="$white1" mb="$xxlarge">
        <View maxWidth={480} width="100%" margin="auto" px="$medium" gap="$medium" py="$medium">
          <SkeCard>
            <SkeCard.Content>
              <SkeCard.Title />
              <SkeCard.Image />
              <SkeCard.Line width="100%" />
              <SkeCard.Image />
              <SkeCard.Image />
            </SkeCard.Content>
          </SkeCard>
        </View>
      </View>
      <YStack>
        <View>
          <SkeCard>
            <SkeCard.Image />
          </SkeCard>
        </View>
        <View gap="$medium">
          <ReferralsRankingCardLoading />
        </View>
      </YStack>
    </View>
  )
}

export function ReferralsSkeleton() {
  const media = useMedia()
  return media.gtSm ? <ReferralsDesktopSkeleton /> : <ReferralsMobileSkeleton />
}

