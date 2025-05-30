import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import Text from '@/components/base/Text'
import ReferralScoreboardTable, { ReferralScoreboardTableEmptyState } from '@/features/referrals/components/ReferralScoreboardTable'

interface ReferralsRankingCardProps {
  title: string
  data?: any[]
}

const ReferralsRankingCard = ({ title, data }: ReferralsRankingCardProps) => {
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

export default ReferralsRankingCard
