import VoxCard from '@/components/VoxCard/VoxCard'
import Text from '@/components/base/Text'
import ReferralScoreboardTable from '@/features/referrals/components/ReferralScoreboardTable'

interface ReferralsRankingCardProps {
  title: string
  data?: any[]
}

const ReferralsRankingCard = ({ title, data }: ReferralsRankingCardProps) => {
  if (!data?.length) return null

  return (
    <VoxCard overflow="hidden" gap={0}>
      <Text.MD pt="$medium" px="$medium" semibold>
        {title}
      </Text.MD>
      <ReferralScoreboardTable data={data} />
    </VoxCard>
  )
}

export default ReferralsRankingCard
