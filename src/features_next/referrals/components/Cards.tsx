import { Share2, HeartHandshake } from '@tamagui/lucide-icons'
import { Platform } from 'react-native'
import { Circle, View, XStack, YStack, useMedia } from 'tamagui'
import { useState, useCallback } from 'react'
import { Image } from 'expo-image'

import SkeCard from '@/components/Skeleton/CardSkeleton'
import StatsCard from '@/components/StatsCard/StatsCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import Text from '@/components/base/Text'
import ProfilePicture from '@/components/ProfilePicture'
import { VoxButton } from '@/components/Button'
import Button from '@/components/Button'
import ShareButton from '@/components/Buttons/ShareButton'
import InstanceCard from '@/components/InstanceCard/InstanceCard'

import { useShareOrCopy } from '@/hooks/useShareOrCopy'
import { useHandleCopyUrl } from '@/hooks/useHandleCopy'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { useReferralStatistics, useReferrals } from '@/services/referral/hook'
import { useGetProfil } from '@/services/profile/hook'
import i18n from '@/utils/i18n'

import ReferralScoreboardTable, { ReferralScoreboardTableEmptyState } from './Scoreboard'
import { ReferralListEmptyState } from './List'
import ReferralFormModal from './Form'

// ============================================================================
// RANKING CARD
// ============================================================================

interface ReferralsRankingCardProps {
  title: string
  data?: any[]
}

export const ReferralsRankingCard = ({ title, data }: ReferralsRankingCardProps) => {
  if (!data) return null

  if (data.length === 0) {
    return (
      <VoxCard>
        <VoxCard.Content>
          <ReferralScoreboardTableEmptyState />
        </VoxCard.Content>
      </VoxCard>
    )
  }

  return (
    <VoxCard overflow="hidden" gap={0}>
      <Text.MD pt="$medium" px="$medium" semibold>
        {title}
      </Text.MD>
      <ReferralScoreboardTable data={data} national={title === 'National'} />
    </VoxCard>
  )
}

export const ReferralsRankingCardLoading = () => {
  return (
    <SkeCard>
      <SkeCard.Content>
        <SkeCard.Line width={150} />
        <SkeCard.Separator py={0} />
        <SkeCard.Title />
        <SkeCard.Separator />
        <SkeCard.Title />
        <SkeCard.Separator />
        <SkeCard.Title />
        <SkeCard.Separator />
        <SkeCard.Title />
      </SkeCard.Content>
    </SkeCard>
  )
}

export const ReferralsTrackingCard = () => {
  const { data: referrals } = useReferrals()
  const { data: statistics, isLoading } = useReferralStatistics()
  const media = useMedia()

  return (
    <VoxCard>
      <VoxCard.Content>
        {referrals?.items.length === 0 ? (
          <ReferralListEmptyState />
        ) : (
          <>
            <Text.MD semibold display={media.sm ? 'none' : undefined}>Suivi des parrainages</Text.MD>
            <XStack alignItems="center" gap="$medium">
              <XStack flex={1}>
                <StatsCard
                  count={statistics?.nb_referral_finished ?? 0}
                  label={i18n.t('referral.finished', { count: statistics?.nb_referral_finished })}
                  backgroundColor="$green1"
                  color="$green5"
                  isLoading={isLoading}
                />
              </XStack>
              <XStack flex={1} justifyContent="center">
                <StatsCard
                  count={statistics?.nb_referral_sent ?? 0}
                  label={i18n.t('referral.sent', { count: statistics?.nb_referral_sent })}
                  backgroundColor="$gray1"
                  color="$gray5"
                  isLoading={isLoading}
                />
              </XStack>
              <XStack flex={1} justifyContent="flex-end">
                <StatsCard
                  count={statistics?.nb_referral_reported ?? 0}
                  label={i18n.t('referral.reported', { count: statistics?.nb_referral_reported })}
                  backgroundColor="$orange1"
                  color="$orange5"
                  isLoading={isLoading}
                />
              </XStack>
            </XStack>

            <YStack borderRadius="$4">
              {referrals?.items.map((item, index) => {
                const referralType = item.type === 'invitation' ? 'Invitation' : item.type === 'preregistration' ? 'Préinscription' : 'Lien'
                const color = item.status === 'adhesion_finished' ? '$green6' : item.status === 'account_created' ? '$orange9' : '$gray6'
                
                return (
                  <View
                    key={item.uuid}
                    backgroundColor={index % 2 ? '$white1' : '$textSurface'}
                    p="$medium"
                  >
                    <XStack justifyContent="space-between" alignItems="center" gap="$4">
                      <YStack flex={1} minWidth={0}>
                        <Text fontWeight="500" lineHeight={20}>
                          {item.first_name} {item.last_name}
                        </Text>
                        <Text color="$textSecondary" lineHeight={20}>
                          {referralType}
                        </Text>
                        <Text color="$textDisabled" lineHeight={20} numberOfLines={1} ellipsizeMode="tail">
                          {item.email_address}
                        </Text>
                      </YStack>
                      <YStack alignItems="flex-end" flexShrink={0} minWidth={100}>
                        <Text color={color} lineHeight={20} fontWeight={500}>
                          {item.status_label}
                        </Text>
                      </YStack>
                    </XStack>
                  </View>
                )
              })}
            </YStack>
          </>
        )}
      </VoxCard.Content>
    </VoxCard>
  )
}

// ============================================================================
// INVITE CARD
// ============================================================================

export const ReferralsInviteCard = () => {
  const [isOpen, setIsOpen] = useState(false)
  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <VoxCard bg="$orange1" inside flex={1}>
        <VoxCard.Content>
          <Text.LG fontWeight={600}>Invitation par email</Text.LG>
          <Text.SM color="$textSecondary" lineHeight={20} w="90%">
            Invitez ou préinscrivez directement une personne intéressée.
          </Text.SM>
          <VoxButton theme="orange" backgroundColor="$orange9" size="xl" onPress={openModal}>
            J'envoie une invitation
          </VoxButton>
        </VoxCard.Content>
      </VoxCard>
      <ReferralFormModal isOpen={isOpen} closeModal={closeModal} />
    </>
  )
}

// ============================================================================
// LINK CARD
// ============================================================================

export const ReferralsLinkCard = () => {
  const { data: user } = useGetProfil()
  const copyURL = useHandleCopyUrl()
  const { handleShareOrCopy } = useShareOrCopy()

  const onCopyURL = () => copyURL(user?.referral_link ?? '')
  const onShare = () => {
    if (!user?.referral_link) return
    return handleShareOrCopy({ url: user.referral_link, message: "Rejoignez le camp de l'espoir !" })
  }

  return (
    <VoxCard bg="$textSurface" inside>
      <VoxCard.Content>
        <Text.LG fontWeight={600}>Lien de parrainage</Text.LG>
        <Text.SM color="$textSecondary" lineHeight={20}>
          Partagez votre lien d'adhésion personnel. Il vous identifie en tant que parrain.
        </Text.SM>

        <XStack gap="$medium" flex={1}>
          <YStack flexShrink={1}>
            <ShareButton url={user?.referral_link} onPress={onCopyURL} />
          </YStack>
          <YStack>
            <VoxButton variant="outlined" iconRight={Share2} bg="$white1" size="xl" onPress={onShare}>
              Partager
            </VoxButton>
          </YStack>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

// ============================================================================
// SCORE CARD
// ============================================================================

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
      {(isGlobalRanked || isAssemblyRanked) && (
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

export const ReferralScoreCard = ({
  fullName = 'Utilisateur',
  globalRank,
  assemblyRank,
  nbReferralFinished,
  nbReferralSent,
  nbReferralFinishedGoal = 3,
  nbReferralSentdGoal = 3,
  profileImage,
  assemblyName,
}: ReferralScoreCardProps) => {
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

// ============================================================================
// LOCKED CARD
// ============================================================================

export const ReferralLockedCard = ({ hideHeader }: { hideHeader?: boolean }) => {
  const { isPending, open: openAdh } = useOpenExternalContent({ slug: 'adhesion', utm_campaign: 'parrainages' })

  return (
    <InstanceCard title="Parrainages" icon={HeartHandshake} hideHeader={hideHeader}>
      <YStack alignItems={'center'} gap={'$medium'} justifyContent={'center'}>
        <View margin={'$medium'}>
          <Image source={require('@/assets/illustrations/VisuCadnas.png')} contentFit={'contain'} style={{ height: 153, width: 88 }} />
        </View>

        <Text bold>Les parrainages sont réservés aux adhérents. Adhérez pour y participer.</Text>

        <VoxButton theme="yellow" size="lg" disabled={isPending} onPress={openAdh()} alignSelf={'center'}>
          J'adhère
        </VoxButton>
      </YStack>
    </InstanceCard>
  )
}

// ============================================================================
// DENY CARD
// ============================================================================

export const ReferralDenyCard = () => (
  <YStack>
    <Text>Vous n'avez pas accès aux parrainages.</Text>
  </YStack>
)

