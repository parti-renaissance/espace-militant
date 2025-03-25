import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'

export default function ReferralListCard() {
  return (
    <VoxCard style={{ minHeight: '100%' }} padding={'$8'}>
      <Text.LG fontWeight={600}>Suivi des parrainages</Text.LG>
    </VoxCard>
  )
}
