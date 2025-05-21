import { Platform } from 'react-native'
import VoxCard from '@/components/VoxCard/VoxCard'
import { Circle, View, XStack, YStack } from 'tamagui'
import ProfilePicture from '@/components/ProfilePicture'
import Text from '@/components/base/Text'

type ReferralScoreCardBadgeProps = {
  globalRank?: number | null
  assemblyRank?: number | null
  assemblyName?: string
}

function formatRankLabel(rank?: number | null): string {
  if (typeof rank !== 'number') return 'Non classé'
  if (rank === 1) return '1er'
  return `${rank}e`
}

function ReferralScoreCardBadge({ globalRank, assemblyRank, assemblyName }: ReferralScoreCardBadgeProps) {
  const isGlobalRanked = typeof globalRank === 'number'
  const isAssemblyRanked = typeof assemblyRank === 'number'

  const label = isGlobalRanked
    ? formatRankLabel(globalRank)
    : isAssemblyRanked
    ? formatRankLabel(assemblyRank)
    : 'Non classé'

  const subLabel = isGlobalRanked
    ? 'National'
    : isAssemblyRanked && assemblyName
    ? assemblyName
    : 'Local'

  return (
    <View backgroundColor="$orange3" py="$small" px="$medium" borderRadius="$large">
      <Text.MD color="$orange8" fontWeight="700" textAlign="center">
        {label}
      </Text.MD>
      {subLabel && (
        <Text.SM color="$orange6" semibold textAlign="center">
          {subLabel}
        </Text.SM>
      )}
    </View>
  )
}

type ReferralScoreCardProgressProps = {
  current: number
  goal: number
  label: string
}

function ReferralScoreCardProgress({ current, goal, label }: ReferralScoreCardProgressProps) {
  const rawProgress = (current / goal) * 100
  const progress = Math.min(rawProgress, 100)
  const progressDisplay = `${Math.floor(rawProgress)}%`

  return (
    <>
      <XStack justifyContent="space-between" pb="$small">
        <Text.MD>{label}</Text.MD>
        <Text.MD>{progressDisplay}</Text.MD>
      </XStack>
      <View backgroundColor="$orange3" borderRadius="$large" height={8}>
        <View
          backgroundColor="$orange9"
          height="100%"
          borderRadius="$large"
          px="$small"
          width={`${progress}%`}
          animation="quick"
        />
      </View>
    </>
  )
}

type ReferralScoreCardProps = {
  fullName?: string
  rank?: number | null
  globalRank?: number | null
  assemblyRank?: number | null
  referralCount?: number
  nbReferralFinished: number
  nbReferralSent: number
  nbReferralFinishedGoal?: number
  nbReferralSentdGoal?: number
  referralGoal?: number
  profileImage?: string | null
  assemblyName?: string
}

export default function ReferralScoreCard({
  fullName = 'Utilisateur',
  globalRank,
  assemblyRank,
  nbReferralFinished,
  nbReferralSent,
  nbReferralFinishedGoal = 3,
  nbReferralSentdGoal = 3,
  profileImage,
  assemblyName,
}: ReferralScoreCardProps) {
  const isInvitationGoalReached = nbReferralSent >= nbReferralSentdGoal
  const label = isInvitationGoalReached
    ? `Objectif : faire adhérer ${nbReferralFinishedGoal} personnes`
    : `Objectif : inviter ${nbReferralSentdGoal} personnes`

  const current = isInvitationGoalReached ? nbReferralFinished : nbReferralSent
  const goal = isInvitationGoalReached ? nbReferralFinishedGoal : nbReferralSentdGoal

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
              <ReferralScoreCardBadge globalRank={globalRank} assemblyRank={assemblyRank} assemblyName={assemblyName} />
            </View>
            <YStack width="100%" mb="$medium">
              <ReferralScoreCardProgress current={current} goal={goal} label={label} />
            </YStack>
          </YStack>
        </VoxCard.Content>
      </VoxCard>
    </YStack>
  )
}
