import { useGetDonations } from '@/services/profile/hook'
import FirstDonationCard from './FirstDonationCard'
import { FullWrapper } from './FullWrapper'
import SubscribeDonationCard from './SubscribeDonationCard'

const DonationCard = (props: { full?: boolean }) => {
  const { data } = useGetDonations()
  const hasSubscriptions = data?.find((x) => x.status === 'subscription_in_progress')
  return (
    <FullWrapper title="Dons" full={props.full}>
      {hasSubscriptions ? <SubscribeDonationCard full={props.full} subscription={hasSubscriptions} /> : <FirstDonationCard full={props.full} />}
    </FullWrapper>
  )
}

export default DonationCard
