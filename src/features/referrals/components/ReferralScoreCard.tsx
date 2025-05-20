import { Platform } from 'react-native'
import VoxCard from '@/components/VoxCard/VoxCard'
import { Circle, View, XStack, YStack } from 'tamagui'
import ProfilePicture from '@/components/ProfilePicture'
import Text from '@/components/base/Text'

type ReferralScoreCardBadgeProps = {
  rank?: number | null
}

function formatRankLabel(rank?: number | null): string {
  if (typeof rank !== 'number') return 'Non classé'
  if (rank === 1) return '1er'
  return `${rank}e`
}

function ReferralScoreCardBadge({ rank }: ReferralScoreCardBadgeProps) {
  const label = formatRankLabel(rank)

  return (
    <View backgroundColor="$orange3" py="$small" px="$medium" borderRadius="$large">
      <Text.MD color="$orange8" fontWeight="700">
        {label}
      </Text.MD>
    </View>
  )
}

type ReferralScoreCardProgressProps = {
  current: number
  goal: number
  deadline?: string // format: YYYY-MM-DD
}

function ReferralScoreCardProgress({ current, goal, deadline = '2025-07-15' }: ReferralScoreCardProgressProps) {
  const rawProgress = (current / goal) * 100
  const progress = Math.min(rawProgress, 100)
  const progressDisplay = `${Math.floor(rawProgress)}%`

  return (
    <>
      <XStack justifyContent="space-between" pb="$small">
        <Text.MD>Objectif : faire adhérer {goal} personnes</Text.MD>
        <Text.MD>{progressDisplay}</Text.MD>
      </XStack>
      <View backgroundColor="$orange3" borderRadius="$large" height={8}>
        <View
          backgroundColor="$orange9"
          height="100%"
          borderRadius="$large"
          width={`${progress}%`}
          animation="quick"
        />
      </View>
      <XStack pt="$small">
        <Text.SM color="$textSecondary" fontWeight="600">
          Jusqu’au {new Date(deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text.SM>
      </XStack>
    </>
  )
}

type ReferralScoreCardProps = {
  fullName?: string
  rank?: number | null
  referralCount: number
  referralGoal?: number
  profileImage?: string | null
}

export default function ReferralScoreCard({
  fullName = 'Utilisateur',
  rank,
  referralCount,
  referralGoal = 3,
  profileImage
}: ReferralScoreCardProps) {
  return (
    <YStack gap="$medium">
      
      <VoxCard backgroundColor="$orange1" inside>
        <VoxCard.Content>
          <YStack justifyContent="center" alignItems="center">
          <Circle backgroundColor="$orange3" p={4} mt="$medium">
              <ProfilePicture
                fullName={fullName}
                src={profileImage ?? undefined}
                alt="Photo de profil"
                size="$12"
                margin={Platform.OS === 'ios' ? -2 : undefined}
                rounded
                backgroundColor="$orange1"
                textColor="$orange5"
              />
            </Circle>
            <View top={-16}>
              <ReferralScoreCardBadge rank={rank} />
            </View>
            <YStack width="100%">
              <ReferralScoreCardProgress current={referralCount} goal={referralGoal} />
            </YStack>
          </YStack>
        </VoxCard.Content>
      </VoxCard>
    </YStack>
  )
}
